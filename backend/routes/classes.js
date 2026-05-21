import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, auditLog } from '../middleware/auth.js';

const router = express.Router();

// Get all divisions/classes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { standard_id, academic_session_id, search } = req.query;

    let whereConditions = [];
    let params = [];
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
      paramIndex++;
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
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching divisions:', err);
    res.status(500).json({ error: 'Failed to fetch divisions' });
  }
});

// Get single division with details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
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
      pool.query(query, [id]),
      pool.query(studentsQuery, [id]),
      pool.query(teachersQuery, [id])
    ]);

    if (divisionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Division not found' });
    }

    res.json({
      ...divisionResult.rows[0],
      students: studentsResult.rows,
      teachers: teachersResult.rows
    });
  } catch (err) {
    console.error('Error fetching division:', err);
    res.status(500).json({ error: 'Failed to fetch division' });
  }
});

// Create division
router.post('/', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { name, standard_id, academic_session_id, section, room_number, capacity } = req.body;

    if (!name || !standard_id || !academic_session_id) {
      return res.status(400).json({ error: 'Name, standard, and academic session are required' });
    }

    const result = await pool.query(
      `INSERT INTO divisions (name, standard_id, academic_session_id, section, room_number, capacity)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, standard_id, academic_session_id, section, room_number, capacity || 40]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating division:', err);
    res.status(500).json({ error: 'Failed to create division' });
  }
});

// Update division
router.put('/:id', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, section, room_number, capacity } = req.body;

    const result = await pool.query(
      `UPDATE divisions SET name = COALESCE($1, name), section = COALESCE($2, section),
       room_number = COALESCE($3, room_number), capacity = COALESCE($4, capacity), updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [name, section, room_number, capacity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Division not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating division:', err);
    res.status(500).json({ error: 'Failed to update division' });
  }
});

// Assign teacher to class
router.post('/:id/teachers', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    const { teacher_id, is_class_teacher } = req.body;

    await pool.query(
      `INSERT INTO class_teachers (division_id, teacher_id, is_class_teacher) 
       VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [id, teacher_id, is_class_teacher || false]
    );

    res.json({ message: 'Teacher assigned to class' });
  } catch (err) {
    console.error('Error assigning teacher:', err);
    res.status(500).json({ error: 'Failed to assign teacher' });
  }
});

// Remove teacher from class
router.delete('/:id/teachers/:teacherId', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id, teacherId } = req.params;
    
    await pool.query(
      'DELETE FROM class_teachers WHERE division_id = $1 AND teacher_id = $2',
      [id, teacherId]
    );

    res.json({ message: 'Teacher removed from class' });
  } catch (err) {
    console.error('Error removing teacher:', err);
    res.status(500).json({ error: 'Failed to remove teacher' });
  }
});

// Delete division
router.delete('/:id', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM divisions WHERE id = $1', [id]);
    res.json({ message: 'Division deleted successfully' });
  } catch (err) {
    console.error('Error deleting division:', err);
    res.status(500).json({ error: 'Failed to delete division' });
  }
});

export default router;