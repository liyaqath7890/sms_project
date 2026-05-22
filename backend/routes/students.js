import express from 'express';
import StudentsController from '../controllers/StudentsController.js';
import { authenticateToken, authorizePermissions, auditLog } from '../middleware/auth.js';
import { PERMISSIONS } from '../config/rbac.js';

const router = express.Router();

router.get('/', authenticateToken, authorizePermissions(PERMISSIONS.STUDENTS_READ), StudentsController.getAllStudents);
router.get('/stats/overview', authenticateToken, authorizePermissions(PERMISSIONS.STUDENTS_READ), StudentsController.getStats);
router.get('/:id', authenticateToken, authorizePermissions(PERMISSIONS.STUDENTS_READ), StudentsController.getStudentById);
router.post('/', authenticateToken, authorizePermissions(PERMISSIONS.STUDENTS_WRITE), auditLog, StudentsController.createStudent);
router.put('/:id', authenticateToken, authorizePermissions(PERMISSIONS.STUDENTS_WRITE), auditLog, StudentsController.updateStudent);
router.delete('/:id', authenticateToken, authorizePermissions(PERMISSIONS.STUDENTS_WRITE), auditLog, StudentsController.deleteStudent);

export default router;
