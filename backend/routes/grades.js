import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, auditLog } from '../middleware/auth.js';

const router = express.Router();

// Get all grades
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, student_id, course_id, academic_session_id, term } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];
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
    params.push(limit, offset);

    const countQuery = `SELECT COUNT(*) FROM grades g ${whereClause}`;
    
    const [gradesResult, countResult] = await Promise.all([
      pool.query(gradesQuery, params),
      pool.query(countQuery, params.slice(0, -2))
    ]);

    res.json({
      grades: gradesResult.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (err) {
    console.error('Error fetching grades:', err);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

// Get student grade report
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academic_session_id, term } = req.query;

    let whereConditions = [`g.student_id = $1`];
    let params = [studentId];
    let paramIndex = 2;

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

    // Calculate GPA
    const totalPoints = result.rows.reduce((sum, g) => sum + (g.grade_point || 0), 0);
    const gpa = result.rows.length > 0 ? (totalPoints / result.rows.length).toFixed(2) : 0;

    res.json({
      grades: result.rows,
      gpa: parseFloat(gpa),
      totalCredits: result.rows.reduce((sum, g) => sum + (g.credits || 0), 0)
    });
  } catch (err) {
    console.error('Error fetching student grades:', err);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

// Create/Update grade
router.post('/', authenticateToken, authorizeRoles('admin', 'teacher'), auditLog, async (req, res) => {
  try {
    const { student_id, course_id, academic_session_id, term, marks, grade, grade_point, remarks } = req.body;

    if (!student_id || !course_id || !academic_session_id || !term) {
      return res.status(400).json({ error: 'Student, course, session, and term are required' });
    }

    // Check if grade already exists
    const existing = await pool.query(
      `SELECT id FROM grades WHERE student_id = $1 AND course_id = $2 
       AND academic_session_id = $3 AND term = $4`,
      [student_id, course_id, academic_session_id, term]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update existing
      result = await pool.query(
        `UPDATE grades SET marks = $1, grade = $2, grade_point = $3, remarks = $4, updated_at = NOW()
         WHERE id = $5 RETURNING *`,
        [marks, grade, grade_point, remarks, existing.rows[0].id]
      );
    } else {
      // Insert new
      result = await pool.query(
        `INSERT INTO grades (student_id, course_id, academic_session_id, term, marks, grade, grade_point, remarks)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [student_id, course_id, academic_session_id, term, marks, grade, grade_point, remarks]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving grade:', err);
    res.status(500).json({ error: 'Failed to save grade' });
  }
});

// Bulk grade entry
router.post('/bulk', authenticateToken, authorizeRoles('admin', 'teacher'), auditLog, async (req, res) => {
  try {
    const { grades } = req.body; // Array of grade objects

    if (!Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({ error: 'Grades array is required' });
    }

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
      res.json({ message: `${grades.length} grades saved successfully` });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error saving bulk grades:', err);
    res.status(500).json({ error: 'Failed to save grades' });
  }
});

// Delete grade
router.delete('/:id', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM grades WHERE id = $1', [id]);
    res.json({ message: 'Grade deleted successfully' });
  } catch (err) {
    console.error('Error deleting grade:', err);
    res.status(500).json({ error: 'Failed to delete grade' });
  }
});

export default router;