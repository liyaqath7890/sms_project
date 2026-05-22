import express from 'express';
import ClassesController from '../controllers/ClassesController.js';
import { authenticateToken, authorizePermissions, auditLog } from '../middleware/auth.js';
import { PERMISSIONS } from '../config/rbac.js';

const router = express.Router();

// Get all divisions/classes
router.get('/', authenticateToken, authorizePermissions(PERMISSIONS.CLASSES_MANAGE), ClassesController.getAllDivisions);

// Get single division with details
router.get('/:id', authenticateToken, authorizePermissions(PERMISSIONS.CLASSES_MANAGE), ClassesController.getDivisionById);

// Create division
router.post('/', authenticateToken, authorizePermissions(PERMISSIONS.CLASSES_MANAGE), auditLog, ClassesController.createDivision);

// Update division
router.put('/:id', authenticateToken, authorizePermissions(PERMISSIONS.CLASSES_MANAGE), auditLog, ClassesController.updateDivision);

// Assign teacher to class
router.post('/:id/teachers', authenticateToken, authorizePermissions(PERMISSIONS.CLASSES_MANAGE), auditLog, ClassesController.assignTeacher);

// Remove teacher from class
router.delete('/:id/teachers/:teacherId', authenticateToken, authorizePermissions(PERMISSIONS.CLASSES_MANAGE), auditLog, ClassesController.removeTeacher);

// Delete division
router.delete('/:id', authenticateToken, authorizePermissions(PERMISSIONS.CLASSES_MANAGE), auditLog, ClassesController.deleteDivision);

export default router;
