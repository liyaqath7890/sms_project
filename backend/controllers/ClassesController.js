import ClassesService from '../services/ClassesService.js';

class ClassesController {
  static async getAllDivisions(req, res) {
    try {
      const divisions = await ClassesService.getDivisions(req.query);
      res.json(divisions);
    } catch (error) {
      console.error('Error in ClassesController.getAllDivisions:', error);
      res.status(500).json({ error: 'Failed to fetch divisions' });
    }
  }

  static async getDivisionById(req, res) {
    try {
      const division = await ClassesService.getDivision(req.params.id);

      if (!division) {
        return res.status(404).json({ error: 'Division not found' });
      }

      res.json(division);
    } catch (error) {
      console.error('Error in ClassesController.getDivisionById:', error);
      res.status(500).json({ error: 'Failed to fetch division' });
    }
  }

  static async createDivision(req, res) {
    try {
      const division = await ClassesService.createDivision(req.body);
      res.status(201).json(division);
    } catch (error) {
      console.error('Error in ClassesController.createDivision:', error);
      res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create division' });
    }
  }

  static async updateDivision(req, res) {
    try {
      const division = await ClassesService.updateDivision(req.params.id, req.body);

      if (!division) {
        return res.status(404).json({ error: 'Division not found' });
      }

      res.json(division);
    } catch (error) {
      console.error('Error in ClassesController.updateDivision:', error);
      res.status(500).json({ error: 'Failed to update division' });
    }
  }

  static async assignTeacher(req, res) {
    try {
      await ClassesService.assignTeacher(req.params.id, req.body);
      res.json({ message: 'Teacher assigned to class' });
    } catch (error) {
      console.error('Error in ClassesController.assignTeacher:', error);
      res.status(500).json({ error: 'Failed to assign teacher' });
    }
  }

  static async removeTeacher(req, res) {
    try {
      await ClassesService.removeTeacher(req.params.id, req.params.teacherId);
      res.json({ message: 'Teacher removed from class' });
    } catch (error) {
      console.error('Error in ClassesController.removeTeacher:', error);
      res.status(500).json({ error: 'Failed to remove teacher' });
    }
  }

  static async deleteDivision(req, res) {
    try {
      await ClassesService.deleteDivision(req.params.id);
      res.json({ message: 'Division deleted successfully' });
    } catch (error) {
      console.error('Error in ClassesController.deleteDivision:', error);
      res.status(500).json({ error: 'Failed to delete division' });
    }
  }
}

export default ClassesController;
