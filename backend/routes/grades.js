import express from 'express';
import GradesController from '../controllers/GradesController.js';
import { authenticateToken, authorizePermissions, auditLog } from '../middleware/auth.js';
import { PERMISSIONS } from '../config/rbac.js';

const router = express.Router();

// Get all grades
router.get('/', authenticateToken, authorizePermissions(PERMISSIONS.GRADES_READ), GradesController.getAllGrades);

// Get student grade report
router.get('/student/:studentId', authenticateToken, authorizePermissions(PERMISSIONS.GRADES_READ), GradesController.getStudentGradeReport);

// Create/Update grade
router.post('/', authenticateToken, authorizePermissions(PERMISSIONS.GRADES_WRITE), auditLog, GradesController.saveGrade);

// Bulk grade entry
router.post('/bulk', authenticateToken, authorizePermissions(PERMISSIONS.GRADES_WRITE), auditLog, GradesController.saveGradesBulk);

// Delete grade
router.delete('/:id', authenticateToken, authorizePermissions(PERMISSIONS.GRADES_WRITE), auditLog, GradesController.deleteGrade);

export default router;
