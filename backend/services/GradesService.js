import GradesRepository from '../repositories/GradesRepository.js';

class GradesService {
  static async getGrades(query) {
    const { page = 1, limit = 20, student_id, course_id, academic_session_id, term } = query;
    const numericPage = parseInt(page, 10);
    const numericLimit = parseInt(limit, 10);
    const offset = (numericPage - 1) * numericLimit;

    const { rows, total } = await GradesRepository.fetchGrades({
      offset,
      limit: numericLimit,
      student_id,
      course_id,
      academic_session_id,
      term
    });

    return {
      grades: rows,
      total,
      page: numericPage,
      totalPages: Math.ceil(total / numericLimit)
    };
  }

  static async getStudentGradeReport(studentId, query) {
    const grades = await GradesRepository.fetchStudentGradeReport(studentId, query);
    const totalPoints = grades.reduce((sum, grade) => sum + (grade.grade_point || 0), 0);
    const gpa = grades.length > 0 ? (totalPoints / grades.length).toFixed(2) : 0;

    return {
      grades,
      gpa: parseFloat(gpa),
      totalCredits: grades.reduce((sum, grade) => sum + (grade.credits || 0), 0)
    };
  }

  static async saveGrade(payload) {
    const { student_id, course_id, academic_session_id, term } = payload;

    if (!student_id || !course_id || !academic_session_id || !term) {
      const error = new Error('Student, course, session, and term are required');
      error.statusCode = 400;
      throw error;
    }

    return GradesRepository.saveGrade(payload);
  }

  static async saveGradesBulk(grades) {
    if (!Array.isArray(grades) || grades.length === 0) {
      const error = new Error('Grades array is required');
      error.statusCode = 400;
      throw error;
    }

    await GradesRepository.saveGradesBulk(grades);
    return { message: `${grades.length} grades saved successfully` };
  }

  static async deleteGrade(id) {
    return GradesRepository.deleteGrade(id);
  }
}

export default GradesService;
