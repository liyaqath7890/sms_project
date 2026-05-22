import AttendanceService from '../services/AttendanceService.js';

class AttendanceController {
  static async getAttendance(req, res) {
    try {
      const result = await AttendanceService.getAttendance(req.query);
      res.json(result);
    } catch (error) {
      console.error('Error in AttendanceController.getAttendance:', error);
      res.status(500).json({ error: 'Failed to fetch attendance' });
    }
  }

  static async markAttendance(req, res) {
    try {
      await AttendanceService.markAttendance(req.body, req.user);
      res.json({ message: 'Attendance marked successfully' });
    } catch (error) {
      console.error('Error in AttendanceController.markAttendance:', error);
      res.status(error.statusCode || 500).json({ error: error.message || 'Failed to mark attendance' });
    }
  }

  static async getStudentAttendance(req, res) {
    try {
      const result = await AttendanceService.getStudentAttendance(req.params.studentId, req.query);
      res.json(result);
    } catch (error) {
      console.error('Error in AttendanceController.getStudentAttendance:', error);
      res.status(500).json({ error: 'Failed to fetch student attendance' });
    }
  }

  static async getDivisionStats(req, res) {
    try {
      const result = await AttendanceService.getDivisionStats(req.params.divisionId, req.query);
      res.json(result);
    } catch (error) {
      console.error('Error in AttendanceController.getDivisionStats:', error);
      res.status(500).json({ error: 'Failed to fetch attendance statistics' });
    }
  }

  static async updateAttendance(req, res) {
    try {
      const attendance = await AttendanceService.updateAttendance(req.params.id, req.body);

      if (!attendance) {
        return res.status(404).json({ error: 'Attendance record not found' });
      }

      res.json({
        message: 'Attendance updated successfully',
        attendance
      });
    } catch (error) {
      console.error('Error in AttendanceController.updateAttendance:', error);
      res.status(500).json({ error: 'Failed to update attendance' });
    }
  }
}

export default AttendanceController;
