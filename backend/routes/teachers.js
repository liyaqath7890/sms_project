import express from 'express';
import TeachersController from '../controllers/TeachersController.js';
import { authenticateToken, authorizePermissions, auditLog } from '../middleware/auth.js';
import { PERMISSIONS } from '../config/rbac.js';

const router = express.Router();

router.get('/', authenticateToken, authorizePermissions(PERMISSIONS.TEACHERS_READ), TeachersController.getAllTeachers);
router.get('/stats/overview', authenticateToken, authorizePermissions(PERMISSIONS.TEACHERS_READ), TeachersController.getStats);
router.get('/:id', authenticateToken, authorizePermissions(PERMISSIONS.TEACHERS_READ), TeachersController.getTeacherById);
router.post('/', authenticateToken, authorizePermissions(PERMISSIONS.TEACHERS_WRITE), auditLog, TeachersController.createTeacher);
router.put('/:id', authenticateToken, authorizePermissions(PERMISSIONS.TEACHERS_WRITE), auditLog, TeachersController.updateTeacher);
router.delete('/:id', authenticateToken, authorizePermissions(PERMISSIONS.TEACHERS_WRITE), auditLog, TeachersController.deleteTeacher);

export default router;
