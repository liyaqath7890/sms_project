import express from 'express';
import AuthController from '../controllers/AuthController.js';
import { auditLog, authenticateToken } from '../middleware/auth.js';
import {
  validateChangePassword,
  validateLogin,
  validatePasswordReset,
  validatePasswordResetRequest,
  validateRefreshToken,
  validateRegister
} from '../validators/AuthValidators.js';

const router = express.Router();

router.post('/register', validateRegister, auditLog, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/refresh', validateRefreshToken, AuthController.refresh);
router.post('/logout', authenticateToken, auditLog, AuthController.logout);
router.get('/profile', authenticateToken, AuthController.profile);
router.post('/change-password', authenticateToken, validateChangePassword, auditLog, AuthController.changePassword);
router.post('/password-reset/request', validatePasswordResetRequest, AuthController.requestPasswordReset);
router.post('/password-reset/confirm', validatePasswordReset, AuthController.resetPassword);
router.post('/verify-email', AuthController.verifyEmail);

export default router;
