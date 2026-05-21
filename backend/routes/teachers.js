import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, auditLog } from '../middleware/auth.js';

const router = express.Router();

// Get all teachers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, academic_session_id } = req.query;
    const offset = (page - 1) * limit;

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

    const teachersQuery = `
      SELECT
        t.*,
        COUNT(DISTINCT ts.subject_id) as subject_count,
        COUNT(DISTINCT ts.division_id) as division_count
      FROM teachers t
      LEFT JOIN teacher_subjects ts ON t.id = ts.teacher_id
      ${whereClause}
      GROUP BY t.id
      ORDER BY t.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);

    const teachersResult = await pool.query(teachersQuery, params);

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT t.id) as total
      FROM teachers t
      LEFT JOIN teacher_subjects ts ON t.id = ts.teacher_id
      ${whereClause}
    `;

    const countParams = params.slice(0, -2);
    const countResult = await pool.query(countQuery, countParams);

    res.json({
      teachers: teachersResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

// Get teacher by ID with subjects
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get teacher details
    const teacherQuery = 'SELECT * FROM teachers WHERE id = $1';
    const teacherResult = await pool.query(teacherQuery, [id]);

    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Get teacher's subjects and divisions
    const subjectsQuery = `
      SELECT
        ts.*,
        s.name as subject_name,
        s.code as subject_code,
        d.name as division_name,
        st.name as standard_name,
        st.level as standard_level
      FROM teacher_subjects ts
      JOIN subjects s ON ts.subject_id = s.id
      JOIN divisions d ON ts.division_id = d.id
      JOIN standards st ON d.standard_id = st.id
      WHERE ts.teacher_id = $1
      ORDER BY st.level, d.name, s.name
    `;

    const subjectsResult = await pool.query(subjectsQuery, [id]);

    res.json({
      teacher: teacherResult.rows[0],
      subjects: subjectsResult.rows
    });

  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
});

// Create new teacher
router.post('/', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const {
      employee_id,
      first_name,
      last_name,
      date_of_birth,
      gender,
      email,
      phone,
      address,
      qualification,
      experience_years,
      joining_date,
      subjects // Array of {subject_id, division_id, academic_session_id}
    } = req.body;

    if (!employee_id || !first_name || !last_name) {
      return res.status(400).json({ error: 'Employee ID and names are required' });
    }

    // Check if employee ID already exists
    const existingTeacher = await pool.query('SELECT id FROM teachers WHERE employee_id = $1', [employee_id]);
    if (existingTeacher.rows.length > 0) {
      return res.status(409).json({ error: 'Employee ID already exists' });
    }

    // Create user account
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      [email || `${employee_id}@school.com`, 'defaultpassword', 'teacher']
    );

    // Create teacher record
    const teacherQuery = `
      INSERT INTO teachers (
        user_id, employee_id, first_name, last_name, date_of_birth,
        gender, email, phone, address, qualification, experience_years, joining_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const teacherResult = await pool.query(teacherQuery, [
      userResult.rows[0].id,
      employee_id,
      first_name,
      last_name,
      date_of_birth,
      gender,
      email,
      phone,
      address,
      qualification,
      experience_years || 0,
      joining_date || new Date()
    ]);

    const teacher = teacherResult.rows[0];

    // Assign subjects if provided
    if (subjects && subjects.length > 0) {
      const subjectValues = subjects.map(subject =>
        `('${teacher.id}', '${subject.subject_id}', '${subject.division_id}', '${subject.academic_session_id}')`
      ).join(', ');

      await pool.query(`
        INSERT INTO teacher_subjects (teacher_id, subject_id, division_id, academic_session_id)
        VALUES ${subjectValues}
      `);
    }

    res.status(201).json({
      message: 'Teacher created successfully',
      teacher
    });

  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

// Update teacher
router.put('/:id', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.id;
    delete updates.created_at;
    delete updates.user_id;

    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

    const query = `
      UPDATE teachers
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json({
      message: 'Teacher updated successfully',
      teacher: result.rows[0]
    });

  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

// Delete teacher
router.delete('/:id', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;

    const teacherResult = await pool.query('SELECT user_id FROM teachers WHERE id = $1', [id]);
    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const userId = teacherResult.rows[0].user_id;

    await pool.query('DELETE FROM teachers WHERE id = $1', [id]);
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({ message: 'Teacher deleted successfully' });

  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
});

// Assign subjects to teacher
router.post('/:id/subjects', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    const { subjects } = req.body; // Array of {subject_id, division_id, academic_session_id}

    if (!subjects || !Array.isArray(subjects)) {
      return res.status(400).json({ error: 'Subjects array is required' });
    }

    // Verify teacher exists
    const teacherCheck = await pool.query('SELECT id FROM teachers WHERE id = $1', [id]);
    if (teacherCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Insert subject assignments
    const values = subjects.map(subject =>
      `('${id}', '${subject.subject_id}', '${subject.division_id}', '${subject.academic_session_id}')`
    ).join(', ');

    await pool.query(`
      INSERT INTO teacher_subjects (teacher_id, subject_id, division_id, academic_session_id)
      VALUES ${values}
      ON CONFLICT (teacher_id, subject_id, division_id, academic_session_id) DO NOTHING
    `);

    res.json({ message: 'Subjects assigned successfully' });

  } catch (error) {
    console.error('Assign subjects error:', error);
    res.status(500).json({ error: 'Failed to assign subjects' });
  }
});

// Get teacher statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const statsQuery = `
      SELECT
        COUNT(*) as total_teachers,
        AVG(experience_years) as avg_experience,
        COUNT(DISTINCT qualification) as unique_qualifications,
        COUNT(CASE WHEN experience_years >= 5 THEN 1 END) as experienced_teachers
      FROM teachers
    `;

    const result = await pool.query(statsQuery);
    res.json({ stats: result.rows[0] });

  } catch (error) {
    console.error('Get teacher stats error:', error);
    res.status(500).json({ error: 'Failed to fetch teacher statistics' });
  }
});

export default router;