import pool from '../config/database.js';

class ClassesRepository {
  static async fetchDivisions({ standard_id, academic_session_id, search }) {
    const whereConditions = [];
    const params = [];
    let paramIndex = 1;

    if (standard_id) {
      whereConditions.push(`d.standard_id = $${paramIndex}`);
      params.push(standard_id);
      paramIndex++;
    }

    if (academic_session_id) {
      whereConditions.push(`d.academic_session_id = $${paramIndex}`);
      params.push(academic_session_id);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`d.name ILIKE $${paramIndex}`);
      params.push(`%${search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT d.*, s.name as standard_name, s.level as standard_level,
             (SELECT COUNT(*) FROM students st JOIN enrollments e ON st.id = e.student_id
              WHERE e.division_id = d.id AND e.status = 'approved') as student_count,
             (SELECT COUNT(*) FROM class_teachers WHERE division_id = d.id) as teacher_count
      FROM divisions d
      LEFT JOIN standards s ON d.standard_id = s.id
      ${whereClause}
      ORDER BY s.level, d.name
    `;

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async fetchDivisionById(id) {
    const divisionQuery = `
      SELECT d.*, s.name as standard_name, s.level as standard_level
      FROM divisions d
      LEFT JOIN standards s ON d.standard_id = s.id
      WHERE d.id = $1
    `;

    const studentsQuery = `
      SELECT st.*, e.status as enrollment_status
      FROM students st
      JOIN enrollments e ON st.id = e.student_id
      WHERE e.division_id = $1 AND e.status = 'approved'
      ORDER BY st.first_name, st.last_name
    `;

    const teachersQuery = `
      SELECT t.*, ct.is_class_teacher
      FROM teachers t
      JOIN class_teachers ct ON t.id = ct.teacher_id
      WHERE ct.division_id = $1
    `;

    const [divisionResult, studentsResult, teachersResult] = await Promise.all([
      pool.query(divisionQuery, [id]),
      pool.query(studentsQuery, [id]),
      pool.query(teachersQuery, [id])
    ]);

    if (divisionResult.rows.length === 0) {
      return null;
    }

    return {
      ...divisionResult.rows[0],
      students: studentsResult.rows,
      teachers: teachersResult.rows
    };
  }

  static async createDivision({ name, standard_id, academic_session_id, section, room_number, capacity }) {
    const result = await pool.query(
      `INSERT INTO divisions (name, standard_id, academic_session_id, section, room_number, capacity)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, standard_id, academic_session_id, section, room_number, capacity || 40]
    );

    return result.rows[0];
  }

  static async updateDivision(id, { name, section, room_number, capacity }) {
    const result = await pool.query(
      `UPDATE divisions SET name = COALESCE($1, name), section = COALESCE($2, section),
       room_number = COALESCE($3, room_number), capacity = COALESCE($4, capacity), updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [name, section, room_number, capacity, id]
    );

    return result.rows[0] || null;
  }

  static async assignTeacher(divisionId, { teacher_id, is_class_teacher }) {
    await pool.query(
      `INSERT INTO class_teachers (division_id, teacher_id, is_class_teacher)
       VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [divisionId, teacher_id, is_class_teacher || false]
    );
  }

  static async removeTeacher(divisionId, teacherId) {
    await pool.query(
      'DELETE FROM class_teachers WHERE division_id = $1 AND teacher_id = $2',
      [divisionId, teacherId]
    );
  }

  static async deleteDivision(id) {
    await pool.query('DELETE FROM divisions WHERE id = $1', [id]);
  }
}

export default ClassesRepository;
