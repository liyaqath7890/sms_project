import TeachersRepository from '../repositories/TeachersRepository.js';

class TeachersService {
  static async getTeachers(query) {
    const { page = 1, limit = 10, search, academic_session_id } = query;
    const offset = (page - 1) * limit;

    return await TeachersRepository.fetchTeachers({
      offset,
      limit,
      search,
      academic_session_id
    });
  }
}

export default TeachersService;