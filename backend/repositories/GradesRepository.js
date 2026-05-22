import pool from '../config/database.js';

class GradesRepository {
  static async fetchGrades({ offset, limit, student_id, course_id, academic_session_id, term }) {
    const whereConditions = [];
    const params = [];
    let paramIndex = 1;

    if (student_id) {
      whereConditions.push(`g.student_id = $${paramIndex}`);
      params.push(student_id);
      paramIndex++;
    }

    if (course_id) {
      whereConditions.push(`g.course_id = $${paramIndex}`);
      params.push(course_id);
      paramIndex++;
    }

    if (academic_session_id) {
      whereConditions.push(`g.academic_session_id = $${paramIndex}`);
      params.push(academic_session_id);
      paramIndex++;
    }

    if (term) {
      whereConditions.push(`g.term = $${paramIndex}`);
      params.push(term);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const gradesQuery = `
      SELECT g.*, s.first_name, s.last_name, s.admission_number,
             c.name as course_name, c.code as course_code
      FROM grades g
      JOIN students s ON g.student_id = s.id
      JOIN courses c ON g.course_id = c.id
      ${whereClause}
      ORDER BY g.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const countQuery = `SELECT COUNT(*) FROM grades g ${whereClause}`;

    const [gradesResult, countResult] = await Promise.all([
      pool.query(gradesQuery, [...params, limit, offset]),
      pool.query(countQuery, params)
    ]);

    return {
      rows: gradesResult.rows,
      total: parseInt(countResult.rows[0].count, 10)
    };
  }

  static async fetchStudentGradeReport(studentId, { academic_session_id, term }) {
    const whereConditions = ['g.student_id = $1'];
    const params = [studentId];
    let paramIndex = 2;

    if (academic_session_id) {
      whereConditions.push(`g.academic_session_id = $${paramIndex}`);
      params.push(academic_session_id);
      paramIndex++;
    }

    if (term) {
      whereConditions.push(`g.term = $${paramIndex}`);
      params.push(term);
    }

    const query = `
      SELECT g.*, c.name as course_name, c.code as course_code, c.credits,
             t.first_name as teacher_first_name, t.last_name as teacher_last_name
      FROM grades g
      JOIN courses c ON g.course_id = c.id
      LEFT JOIN course_teachers ct ON c.id = ct.course_id
      LEFT JOIN teachers t ON ct.teacher_id = t.id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY c.name
    `;

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async saveGrade({ student_id, course_id, academic_session_id, term, marks, grade, grade_point, remarks }) {
    const existing = await pool.query(
      `SELECT id FROM grades WHERE student_id = $1 AND course_id = $2
       AND academic_session_id = $3 AND term = $4`,
      [student_id, course_id, academic_session_id, term]
    );

    if (existing.rows.length > 0) {
      const result = await pool.query(
        `UPDATE grades SET marks = $1, grade = $2, grade_point = $3, remarks = $4, updated_at = NOW()
         WHERE id = $5 RETURNING *`,
        [marks, grade, grade_point, remarks, existing.rows[0].id]
      );
      return result.rows[0];
    }

    const result = await pool.query(
      `INSERT INTO grades (student_id, course_id, academic_session_id, term, marks, grade, grade_point, remarks)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [student_id, course_id, academic_session_id, term, marks, grade, grade_point, remarks]
    );
    return result.rows[0];
  }

  static async saveGradesBulk(grades) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (const grade of grades) {
        const { student_id, course_id, academic_session_id, term, marks, grade: gradeValue, grade_point, remarks } = grade;
        const existing = await client.query(
          `SELECT id FROM grades WHERE student_id = $1 AND course_id = $2
           AND academic_session_id = $3 AND term = $4`,
          [student_id, course_id, academic_session_id, term]
        );

        if (existing.rows.length > 0) {
          await client.query(
            `UPDATE grades SET marks = $1, grade = $2, grade_point = $3, remarks = $4, updated_at = NOW()
             WHERE id = $5`,
            [marks, gradeValue, grade_point, remarks, existing.rows[0].id]
          );
        } else {
          await client.query(
            `INSERT INTO grades (student_id, course_id, academic_session_id, term, marks, grade, grade_point, remarks)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [student_id, course_id, academic_session_id, term, marks, gradeValue, grade_point, remarks]
          );
        }
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async deleteGrade(id) {
    await pool.query('DELETE FROM grades WHERE id = $1', [id]);
  }
}

export default GradesRepository;
