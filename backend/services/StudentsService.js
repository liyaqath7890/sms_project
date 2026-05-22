import StudentsRepository from '../repositories/StudentsRepository.js';

class StudentsService {
  static async getStudents(query) {
    const { page = 1, limit = 10, division_id, standard_id, search, academic_session_id } = query;
    const offset = (page - 1) * limit;

    return await StudentsRepository.fetchStudents({
      offset,
      limit,
      division_id,
      standard_id,
      search,
      academic_session_id
    });
  }
}

export default StudentsService;