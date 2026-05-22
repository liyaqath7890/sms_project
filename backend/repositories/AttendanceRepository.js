import pool from '../config/database.js';

class AttendanceRepository {
  static buildFilters(filters) {
    const whereConditions = [];
    const params = [];
    let paramIndex = 1;

    const addEqualsFilter = (column, value) => {
      if (value) {
        whereConditions.push(`${column} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    };

    addEqualsFilter('a.student_id', filters.student_id);
    addEqualsFilter('a.division_id', filters.division_id);
    addEqualsFilter('a.subject_id', filters.subject_id);
    addEqualsFilter('a.date', filters.date);

    if (filters.date_from && filters.date_to) {
      whereConditions.push(`a.date BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
      params.push(filters.date_from, filters.date_to);
      paramIndex += 2;
    }

    addEqualsFilter('a.academic_session_id', filters.academic_session_id);

    return { whereConditions, params, paramIndex };
  }

  static async fetchAttendance({ offset, limit, ...filters }) {
    const { whereConditions, params, paramIndex } = AttendanceRepository.buildFilters(filters);
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const attendanceQuery = `
      SELECT
        a.*,
        s.first_name,
        s.last_name,
        s.admission_number,
        sub.name as subject_name,
        d.name as division_name,
        st.name as standard_name,
        t.first_name as teacher_first_name,
        t.last_name as teacher_last_name
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN subjects sub ON a.subject_id = sub.id
      JOIN divisions d ON a.division_id = d.id
      JOIN standards st ON d.standard_id = st.id
      JOIN teachers t ON a.teacher_id = t.id
      ${whereClause}
      ORDER BY a.date DESC, a.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM attendance a
      ${whereClause}
    `;

    const [attendanceResult, countResult] = await Promise.all([
      pool.query(attendanceQuery, [...params, limit, offset]),
      pool.query(countQuery, params)
    ]);

    return {
      rows: attendanceResult.rows,
      total: parseInt(countResult.rows[0].total, 10)
    };
  }

  static async fetchActiveSessionId() {
    const sessionResult = await pool.query('SELECT id FROM academic_sessions WHERE is_active = true LIMIT 1');
    return sessionResult.rows[0]?.id || null;
  }

  static async fetchTeacherIdByUserId(userId) {
    const teacherResult = await pool.query('SELECT id FROM teachers WHERE user_id = $1', [userId]);
    return teacherResult.rows[0]?.id || null;
  }

  static async markClassAttendance({ division_id, subject_id, teacher_id, date, academic_session_id, attendance_records }) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      await client.query(
        'DELETE FROM attendance WHERE division_id = $1 AND subject_id = $2 AND date = $3',
        [division_id, subject_id, date]
      );

      if (attendance_records.length > 0) {
        const values = [];
        const placeholders = attendance_records.map((record, index) => {
          const base = index * 8;
          values.push(
            record.student_id,
            division_id,
            subject_id,
            teacher_id,
            date,
            record.status,
            record.remarks || '',
            academic_session_id
          );

          return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8})`;
        });

        await client.query(
          `INSERT INTO attendance (student_id, division_id, subject_id, teacher_id, date, status, remarks, academic_session_id)
           VALUES ${placeholders.join(', ')}`,
          values
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async fetchStudentAttendance(studentId, { subject_id, date_from, date_to, academic_session_id }) {
    const whereConditions = ['a.student_id = $1'];
    const params = [studentId];
    let paramIndex = 2;

    if (subject_id) {
      whereConditions.push(`a.subject_id = $${paramIndex}`);
      params.push(subject_id);
      paramIndex++;
    }

    if (date_from && date_to) {
      whereConditions.push(`a.date BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
      params.push(date_from, date_to);
      paramIndex += 2;
    }

    if (academic_session_id) {
      whereConditions.push(`a.academic_session_id = $${paramIndex}`);
      params.push(academic_session_id);
    }

    const query = `
      SELECT
        a.*,
        sub.name as subject_name,
        sub.code as subject_code,
        t.first_name as teacher_first_name,
        t.last_name as teacher_last_name
      FROM attendance a
      JOIN subjects sub ON a.subject_id = sub.id
      JOIN teachers t ON a.teacher_id = t.id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY a.date DESC
    `;

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async fetchDivisionStats(divisionId, { date_from, date_to, academic_session_id }) {
    const whereConditions = ['a.division_id = $1'];
    const params = [divisionId];
    let paramIndex = 2;

    if (date_from && date_to) {
      whereConditions.push(`a.date BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
      params.push(date_from, date_to);
      paramIndex += 2;
    }

    if (academic_session_id) {
      whereConditions.push(`a.academic_session_id = $${paramIndex}`);
      params.push(academic_session_id);
    }

    const statsQuery = `
      SELECT
        COUNT(*) as total_records,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count,
        COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count,
        COUNT(DISTINCT student_id) as total_students,
        COUNT(DISTINCT date) as total_days
      FROM attendance a
      WHERE ${whereConditions.join(' AND ')}
    `;

    const result = await pool.query(statsQuery, params);
    return result.rows[0];
  }

  static async updateAttendance(id, { status, remarks }) {
    const query = `
      UPDATE attendance
      SET status = $1, remarks = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;

    const result = await pool.query(query, [status, remarks, id]);
    return result.rows[0] || null;
  }
}

export default AttendanceRepository;
