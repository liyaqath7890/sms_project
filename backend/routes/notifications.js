import express from 'express';
import NotificationController from '../controllers/NotificationController.js';
import { auditLog, authenticateToken, authorizePermissions } from '../middleware/auth.js';
import { PERMISSIONS } from '../config/rbac.js';

const router = express.Router();

router.get('/', authenticateToken, authorizePermissions(PERMISSIONS.NOTIFICATIONS_READ), NotificationController.getNotifications);
router.post('/', authenticateToken, authorizePermissions(PERMISSIONS.NOTIFICATIONS_WRITE), auditLog, NotificationController.createNotification);
router.put('/read-all', authenticateToken, authorizePermissions(PERMISSIONS.NOTIFICATIONS_READ), NotificationController.markAllAsRead);
router.put('/:id/read', authenticateToken, authorizePermissions(PERMISSIONS.NOTIFICATIONS_READ), NotificationController.markAsRead);

export default router;
