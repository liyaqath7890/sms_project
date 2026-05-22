import GradesService from '../services/GradesService.js';

class GradesController {
  static async getAllGrades(req, res) {
    try {
      const result = await GradesService.getGrades(req.query);
      res.json(result);
    } catch (error) {
      console.error('Error in GradesController.getAllGrades:', error);
      res.status(500).json({ error: 'Failed to fetch grades' });
    }
  }

  static async getStudentGradeReport(req, res) {
    try {
      const result = await GradesService.getStudentGradeReport(req.params.studentId, req.query);
      res.json(result);
    } catch (error) {
      console.error('Error in GradesController.getStudentGradeReport:', error);
      res.status(500).json({ error: 'Failed to fetch grades' });
    }
  }

  static async saveGrade(req, res) {
    try {
      const grade = await GradesService.saveGrade(req.body);
      res.status(201).json(grade);
    } catch (error) {
      console.error('Error in GradesController.saveGrade:', error);
      res.status(error.statusCode || 500).json({ error: error.message || 'Failed to save grade' });
    }
  }

  static async saveGradesBulk(req, res) {
    try {
      const result = await GradesService.saveGradesBulk(req.body.grades);
      res.json(result);
    } catch (error) {
      console.error('Error in GradesController.saveGradesBulk:', error);
      res.status(error.statusCode || 500).json({ error: error.message || 'Failed to save grades' });
    }
  }

  static async deleteGrade(req, res) {
    try {
      await GradesService.deleteGrade(req.params.id);
      res.json({ message: 'Grade deleted successfully' });
    } catch (error) {
      console.error('Error in GradesController.deleteGrade:', error);
      res.status(500).json({ error: 'Failed to delete grade' });
    }
  }
}

export default GradesController;
