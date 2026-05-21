import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, auditLog } from '../middleware/auth.js';

const router = express.Router();

// Get all students with optional filtering
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      division_id,
      standard_id,
      search,
      academic_session_id
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    // Add filters
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

    // Get students with pagination
    const studentsQuery = `
      SELECT
        s.*,
        d.name as division_name,
        st.name as standard_name,
        st.level as standard_level,
        st.academic_session_id
      FROM students s
      LEFT JOIN divisions d ON s.division_id = d.id
      LEFT JOIN standards st ON d.standard_id = st.id
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);

    const studentsResult = await pool.query(studentsQuery, params);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM students s
      LEFT JOIN divisions d ON s.division_id = d.id
      LEFT JOIN standards st ON d.standard_id = st.id
      ${whereClause}
    `;

    const countParams = params.slice(0, -2); // Remove limit and offset
    const countResult = await pool.query(countQuery, countParams);

    res.json({
      students: studentsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        s.*,
        d.name as division_name,
        st.name as standard_name,
        st.level as standard_level,
        st.academic_session_id
      FROM students s
      LEFT JOIN divisions d ON s.division_id = d.id
      LEFT JOIN standards st ON d.standard_id = st.id
      WHERE s.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ student: result.rows[0] });

  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Create new student
router.post('/', authenticateToken, authorizeRoles('admin', 'teacher'), auditLog, async (req, res) => {
  try {
    const {
      admission_number,
      first_name,
      last_name,
      date_of_birth,
      gender,
      email,
      phone,
      address,
      parent_name,
      parent_phone,
      parent_email,
      division_id,
      enrollment_date
    } = req.body;

    // Validate required fields
    if (!admission_number || !first_name || !last_name || !division_id) {
      return res.status(400).json({ error: 'Admission number, names, and division are required' });
    }

    // Check if admission number already exists
    const existingStudent = await pool.query('SELECT id FROM students WHERE admission_number = $1', [admission_number]);
    if (existingStudent.rows.length > 0) {
      return res.status(409).json({ error: 'Admission number already exists' });
    }

    // Create user account for student
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      [email || `${admission_number}@school.com`, 'defaultpassword', 'student']
    );

    // Create student record
    const studentQuery = `
      INSERT INTO students (
        user_id, admission_number, first_name, last_name, date_of_birth,
        gender, email, phone, address, parent_name, parent_phone, parent_email,
        division_id, enrollment_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const studentResult = await pool.query(studentQuery, [
      userResult.rows[0].id,
      admission_number,
      first_name,
      last_name,
      date_of_birth,
      gender,
      email,
      phone,
      address,
      parent_name,
      parent_phone,
      parent_email,
      division_id,
      enrollment_date || new Date()
    ]);

    res.status(201).json({
      message: 'Student created successfully',
      student: studentResult.rows[0]
    });

  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update student
router.put('/:id', authenticateToken, authorizeRoles('admin', 'teacher'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.created_at;
    delete updates.user_id;

    // Build update query
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

    const query = `
      UPDATE students
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      message: 'Student updated successfully',
      student: result.rows[0]
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
router.delete('/:id', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;

    // Get student user_id before deletion
    const studentResult = await pool.query('SELECT user_id FROM students WHERE id = $1', [id]);
    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const userId = studentResult.rows[0].user_id;

    // Delete student (cascade will handle related records)
    await pool.query('DELETE FROM students WHERE id = $1', [id]);

    // Delete user account
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({ message: 'Student deleted successfully' });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Get student statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const { academic_session_id } = req.query;

    let sessionFilter = '';
    let params = [];

    if (academic_session_id) {
      sessionFilter = 'WHERE st.academic_session_id = $1';
      params.push(academic_session_id);
    }

    const statsQuery = `
      SELECT
        COUNT(*) as total_students,
        COUNT(CASE WHEN s.gender = 'male' THEN 1 END) as male_students,
        COUNT(CASE WHEN s.gender = 'female' THEN 1 END) as female_students,
        COUNT(DISTINCT d.id) as total_divisions,
        COUNT(DISTINCT st.id) as total_standards
      FROM students s
      LEFT JOIN divisions d ON s.division_id = d.id
      LEFT JOIN standards st ON d.standard_id = st.id
      ${sessionFilter}
    `;

    const result = await pool.query(statsQuery, params);
    res.json({ stats: result.rows[0] });

  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({ error: 'Failed to fetch student statistics' });
  }
});

export default router;