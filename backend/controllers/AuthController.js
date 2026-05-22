import AuthService from '../services/AuthService.js';
import { sendSuccess } from '../utils/apiResponse.js';

class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.registerUser(req.body, req);
      sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body, req);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req, res, next) {
    try {
      const result = await AuthService.refresh(req.body.refreshToken, req);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const result = await AuthService.logout({
        refreshToken: req.body.refreshToken,
        userId: req.user?.id
      });
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async profile(req, res, next) {
    try {
      const result = await AuthService.getProfile(req.user.id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const result = await AuthService.changePassword(req.user.id, req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async requestPasswordReset(req, res, next) {
    try {
      const result = await AuthService.requestPasswordReset(req.body.email);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const result = await AuthService.resetPassword(req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req, res, next) {
    try {
      const result = await AuthService.verifyEmail(req.body.token || req.query.token);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
