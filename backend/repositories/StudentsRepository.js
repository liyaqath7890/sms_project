import pool from '../config/database.js';

class StudentsRepository {
  static async fetchStudents({ offset, limit, division_id, standard_id, search, academic_session_id }) {
    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (division_id) {
      whereConditions.push(`s.division_id = $${paramIndex}`);
      params.push(division_id);
      paramIndex++;
    }

    if (standard_id) {
      whereConditions.push(`d.standard_id = $${paramIndex}`);
      params.push(standard_id);
      paramIndex++;
    }

    if (academic_session_id) {
      whereConditions.push(`st.academic_session_id = $${paramIndex}`);
      params.push(academic_session_id);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(s.first_name ILIKE $${paramIndex} OR s.last_name ILIKE $${paramIndex} OR s.admission_number ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT s.*, d.name as division_name, st.name as standard_name
      FROM students s
      JOIN divisions d ON s.division_id = d.id
      JOIN standards st ON d.standard_id = st.id
      ${whereClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }
}

export default StudentsRepository;