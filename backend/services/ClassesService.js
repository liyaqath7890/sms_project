import ClassesRepository from '../repositories/ClassesRepository.js';

class ClassesService {
  static async getDivisions(query) {
    const { standard_id, academic_session_id, search } = query;
    return ClassesRepository.fetchDivisions({ standard_id, academic_session_id, search });
  }

  static async getDivision(id) {
    return ClassesRepository.fetchDivisionById(id);
  }

  static async createDivision(payload) {
    const { name, standard_id, academic_session_id } = payload;

    if (!name || !standard_id || !academic_session_id) {
      const error = new Error('Name, standard, and academic session are required');
      error.statusCode = 400;
      throw error;
    }

    return ClassesRepository.createDivision(payload);
  }

  static async updateDivision(id, payload) {
    return ClassesRepository.updateDivision(id, payload);
  }

  static async assignTeacher(divisionId, payload) {
    return ClassesRepository.assignTeacher(divisionId, payload);
  }

  static async removeTeacher(divisionId, teacherId) {
    return ClassesRepository.removeTeacher(divisionId, teacherId);
  }

  static async deleteDivision(id) {
    return ClassesRepository.deleteDivision(id);
  }
}

export default ClassesService;
