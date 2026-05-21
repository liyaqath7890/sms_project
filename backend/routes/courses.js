import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, auditLog } from '../middleware/auth.js';

const router = express.Router();

// Get all courses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, standard_id, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (standard_id) {
      whereConditions.push(`c.standard_id = $${paramIndex}`);
      params.push(standard_id);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(c.name ILIKE $${paramIndex} OR c.code ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const coursesQuery = `
      SELECT c.*, s.name as standard_name, s.level as standard_level,
             (SELECT COUNT(*) FROM course_teachers WHERE course_id = c.id) as teacher_count
      FROM courses c
      LEFT JOIN standards s ON c.standard_id = s.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const countQuery = `SELECT COUNT(*) FROM courses c ${whereClause}`;
    
    const [coursesResult, countResult] = await Promise.all([
      pool.query(coursesQuery, params),
      pool.query(countQuery, params.slice(0, -2))
    ]);

    res.json({
      courses: coursesResult.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get single course
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const courseQuery = `
      SELECT c.*, s.name as standard_name, s.level as standard_level
      FROM courses c
      LEFT JOIN standards s ON c.standard_id = s.id
      WHERE c.id = $1
    `;
    
    const teachersQuery = `
      SELECT t.id, t.first_name, t.last_name, t.employee_id, t.subject
      FROM teachers t
      JOIN course_teachers ct ON t.id = ct.teacher_id
      WHERE ct.course_id = $1
    `;

    const [courseResult, teachersResult] = await Promise.all([
      pool.query(courseQuery, [id]),
      pool.query(teachersQuery, [id])
    ]);

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({
      ...courseResult.rows[0],
      teachers: teachersResult.rows
    });
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Create course (Admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { name, code, description, standard_id, credits, is_elective } = req.body;

    if (!name || !code || !standard_id) {
      return res.status(400).json({ error: 'Name, code, and standard are required' });
    }

    const result = await pool.query(
      `INSERT INTO courses (name, code, description, standard_id, credits, is_elective) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, code, description, standard_id, credits || 3, is_elective || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update course
router.put('/:id', authenticateToken, authorizeRoles('admin', 'teacher'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, credits, is_elective } = req.body;

    const result = await pool.query(
      `UPDATE courses SET name = COALESCE($1, name), code = COALESCE($2, code), 
       description = COALESCE($3, description), credits = COALESCE($4, credits),
       is_elective = COALESCE($5, is_elective), updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [name, code, description, credits, is_elective, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete course
router.delete('/:id', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Assign teacher to course
router.post('/:id/teachers', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    const { teacher_id } = req.body;

    await pool.query(
      'INSERT INTO course_teachers (course_id, teacher_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [id, teacher_id]
    );

    res.json({ message: 'Teacher assigned to course' });
  } catch (err) {
    console.error('Error assigning teacher:', err);
    res.status(500).json({ error: 'Failed to assign teacher' });
  }
});

export default router;