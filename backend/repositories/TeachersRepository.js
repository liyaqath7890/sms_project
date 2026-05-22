import pool from '../config/database.js';

class TeachersRepository {
  static async fetchTeachers({ offset, limit, search, academic_session_id }) {
    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(`(t.first_name ILIKE $${paramIndex} OR t.last_name ILIKE $${paramIndex} OR t.employee_id ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (academic_session_id) {
      whereConditions.push(`EXISTS (SELECT 1 FROM teacher_subjects ts WHERE ts.teacher_id = t.id AND ts.academic_session_id = $${paramIndex})`);
      params.push(academic_session_id);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT t.*, COUNT(DISTINCT ts.subject_id) as subject_count, COUNT(DISTINCT ts.division_id) as division_count
      FROM teachers t
      LEFT JOIN teacher_subjects ts ON t.id = ts.teacher_id
      ${whereClause}
      GROUP BY t.id
      ORDER BY t.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }
}

export default TeachersRepository;