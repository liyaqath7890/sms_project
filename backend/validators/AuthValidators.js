import { createHttpError } from '../utils/apiResponse.js';
import { normalizeRole, ROLES } from '../config/rbac.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => {
  if (!email || !emailPattern.test(email)) {
    throw createHttpError('A valid email address is required', 400);
  }
};

const validatePassword = (password) => {
  if (!password || password.length < 8) {
    throw createHttpError('Password must be at least 8 characters', 400);
  }
};

export const validateRegister = (req, res, next) => {
  try {
    validateEmail(req.body.email);
    validatePassword(req.body.password);

    const role = normalizeRole(req.body.role || ROLES.STUDENT);
    if (!Object.values(ROLES).includes(role)) {
      throw createHttpError('Invalid role supplied', 400);
    }

    req.body.role = role;
    next();
  } catch (error) {
    next(error);
  }
};

export const validateLogin = (req, res, next) => {
  try {
    validateEmail(req.body.email);
    validatePassword(req.body.password);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateRefreshToken = (req, res, next) => {
  try {
    if (!req.body.refreshToken) {
      throw createHttpError('Refresh token is required', 400);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const validatePasswordResetRequest = (req, res, next) => {
  try {
    validateEmail(req.body.email);
    next();
  } catch (error) {
    next(error);
  }
};

export const validatePasswordReset = (req, res, next) => {
  try {
    if (!req.body.token) {
      throw createHttpError('Reset token is required', 400);
    }
    validatePassword(req.body.password);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateChangePassword = (req, res, next) => {
  try {
    validatePassword(req.body.currentPassword);
    validatePassword(req.body.newPassword);
    next();
  } catch (error) {
    next(error);
  }
};
