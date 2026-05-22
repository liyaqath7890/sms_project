import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import AuthRepository from '../repositories/AuthRepository.js';
import { createHttpError } from '../utils/apiResponse.js';

const ACCESS_TOKEN_TTL = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 7);

const jwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw createHttpError('JWT_SECRET is not configured', 500);
  }
  return process.env.JWT_SECRET;
};

const generateOpaqueToken = () => crypto.randomBytes(48).toString('hex');

class AuthService {
  static signAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        roles: user.roles,
        permissions: user.permissions,
        type: 'access'
      },
      jwtSecret(),
      { expiresIn: ACCESS_TOKEN_TTL }
    );
  }

  static async issueTokens(user, req) {
    const accessToken = AuthService.signAccessToken(user);
    const refreshToken = generateOpaqueToken();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

    await AuthRepository.createRefreshSession({
      userId: user.id,
      refreshToken,
      expiresAt,
      ipAddress: req?.ip,
      userAgent: req?.get?.('User-Agent')
    });

    return {
      accessToken,
      refreshToken,
      token: accessToken,
      expiresIn: ACCESS_TOKEN_TTL
    };
  }

  static async registerUser({ email, password, role, firstName, lastName, ...userData }, req) {
    const existingUser = await AuthRepository.findUserByEmail(email);
    if (existingUser) {
      throw createHttpError('User already exists with this email', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await AuthRepository.createUserWithProfile({
      email,
      passwordHash,
      role,
      firstName,
      lastName,
      userData
    });

    const verificationToken = generateOpaqueToken();
    await AuthRepository.createEmailVerificationToken(
      user.id,
      verificationToken,
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    );

    const tokens = await AuthService.issueTokens(user, req);
    return { user, ...tokens, verificationToken };
  }

  static async login({ email, password }, req) {
    const userWithPassword = await AuthRepository.findUserByEmail(email);

    if (!userWithPassword) {
      await AuthRepository.logLoginActivity({
        email,
        status: 'failed',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        failureReason: 'User not found'
      });
      throw createHttpError('Invalid email or password', 401);
    }

    const passwordValid = await bcrypt.compare(password, userWithPassword.password_hash);
    if (!passwordValid || !userWithPassword.is_active) {
      await AuthRepository.logLoginActivity({
        userId: userWithPassword.id,
        email,
        status: 'failed',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        failureReason: !userWithPassword.is_active ? 'Inactive account' : 'Invalid password'
      });
      throw createHttpError('Invalid email or password', 401);
    }

    const user = await AuthRepository.findUserById(userWithPassword.id);
    const tokens = await AuthService.issueTokens(user, req);

    await AuthRepository.logLoginActivity({
      userId: user.id,
      email: user.email,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    return { user, ...tokens };
  }

  static async refresh(refreshToken, req) {
    const session = await AuthRepository.findRefreshSession(refreshToken);
    if (!session || !session.is_active) {
      throw createHttpError('Invalid refresh token', 401);
    }

    await AuthRepository.revokeRefreshSession(refreshToken);
    const user = await AuthRepository.findUserById(session.user_id);
    const tokens = await AuthService.issueTokens(user, req);
    return { user, ...tokens };
  }

  static async logout({ refreshToken, userId }) {
    if (refreshToken) {
      await AuthRepository.revokeRefreshSession(refreshToken);
      return { message: 'Logged out successfully' };
    }

    if (userId) {
      await AuthRepository.revokeUserSessions(userId);
    }

    return { message: 'Logged out successfully' };
  }

  static async getProfile(userId) {
    const user = await AuthRepository.findUserById(userId);
    if (!user) {
      throw createHttpError('User not found', 404);
    }
    return { user };
  }

  static async changePassword(userId, { currentPassword, newPassword }) {
    const user = await AuthRepository.findUserById(userId);
    const userWithPassword = await AuthRepository.findUserByEmail(user.email);
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.password_hash);

    if (!isCurrentPasswordValid) {
      throw createHttpError('Current password is incorrect', 400);
    }

    await AuthRepository.updatePassword(userId, await bcrypt.hash(newPassword, 12));
    await AuthRepository.revokeUserSessions(userId);
    return { message: 'Password changed successfully' };
  }

  static async requestPasswordReset(email) {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
      return { message: 'If this email exists, a reset link has been prepared' };
    }

    const resetToken = generateOpaqueToken();
    await AuthRepository.createPasswordResetToken(
      user.id,
      resetToken,
      new Date(Date.now() + 60 * 60 * 1000)
    );

    return {
      message: 'If this email exists, a reset link has been prepared',
      resetToken
    };
  }

  static async resetPassword({ token, password }) {
    const resetRecord = await AuthRepository.consumePasswordResetToken(token);
    if (!resetRecord) {
      throw createHttpError('Invalid or expired reset token', 400);
    }

    await AuthRepository.updatePassword(resetRecord.user_id, await bcrypt.hash(password, 12));
    await AuthRepository.revokeUserSessions(resetRecord.user_id);
    return { message: 'Password reset successfully' };
  }

  static async verifyEmail(token) {
    const verification = await AuthRepository.verifyEmailToken(token);
    if (!verification) {
      throw createHttpError('Invalid or expired verification token', 400);
    }

    return { message: 'Email verified successfully' };
  }
}

export default AuthService;
