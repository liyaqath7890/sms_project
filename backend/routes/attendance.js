import express from 'express';
import AttendanceController from '../controllers/AttendanceController.js';
import { authenticateToken, authorizePermissions, auditLog } from '../middleware/auth.js';
import { PERMISSIONS } from '../config/rbac.js';

const router = express.Router();

// Get attendance records
router.get('/', authenticateToken, authorizePermissions(PERMISSIONS.ATTENDANCE_READ), AttendanceController.getAttendance);

// Mark attendance for a class
router.post('/mark', authenticateToken, authorizePermissions(PERMISSIONS.ATTENDANCE_WRITE), auditLog, AttendanceController.markAttendance);

// Get attendance for a specific student
router.get('/student/:studentId', authenticateToken, authorizePermissions(PERMISSIONS.ATTENDANCE_READ), AttendanceController.getStudentAttendance);

// Get attendance statistics for a division
router.get('/stats/division/:divisionId', authenticateToken, authorizePermissions(PERMISSIONS.ATTENDANCE_READ), AttendanceController.getDivisionStats);

// Update individual attendance record
router.put('/:id', authenticateToken, authorizePermissions(PERMISSIONS.ATTENDANCE_WRITE), auditLog, AttendanceController.updateAttendance);

export default router;
