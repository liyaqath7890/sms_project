import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, auditLog } from '../middleware/auth.js';

const router = express.Router();

// Get all enrollments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, standard_id, academic_session_id, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`e.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (standard_id) {
      whereConditions.push(`e.standard_id = $${paramIndex}`);
      params.push(standard_id);
      paramIndex++;
    }

    if (academic_session_id) {
      whereConditions.push(`e.academic_session_id = $${paramIndex}`);
      params.push(academic_session_id);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(s.first_name ILIKE $${paramIndex} OR s.last_name ILIKE $${paramIndex} OR s.admission_number ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const enrollmentsQuery = `
      SELECT e.*, s.first_name, s.last_name, s.admission_number, s.date_of_birth, s.gender,
             st.name as standard_name, st.level as standard_level,
             d.name as division_name,
             a.name as academic_session_name
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      LEFT JOIN standards st ON e.standard_id = st.id
      LEFT JOIN divisions d ON e.division_id = d.id
      LEFT JOIN academic_sessions a ON e.academic_session_id = a.id
      ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const countQuery = `SELECT COUNT(*) FROM enrollments e ${whereClause}`;
    
    const [enrollmentsResult, countResult] = await Promise.all([
      pool.query(enrollmentsQuery, params),
      pool.query(countQuery, params.slice(0, -2))
    ]);

    res.json({
      enrollments: enrollmentsResult.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (err) {
    console.error('Error fetching enrollments:', err);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

// Get single enrollment
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT e.*, s.*, st.name as standard_name, d.name as division_name,
             a.name as academic_session_name
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      LEFT JOIN standards st ON e.standard_id = st.id
      LEFT JOIN divisions d ON e.division_id = d.id
      LEFT JOIN academic_sessions a ON e.academic_session_id = a.id
      WHERE e.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching enrollment:', err);
    res.status(500).json({ error: 'Failed to fetch enrollment' });
  }
});

// Create new enrollment (Admission)
router.post('/', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const {
      first_name, last_name, date_of_birth, gender, email, phone, address,
      guardian_name, guardian_phone, guardian_email, guardian_relation,
      standard_id, division_id, academic_session_id, admission_date
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !standard_id || !academic_session_id) {
      return res.status(400).json({ error: 'Name, standard, and academic session are required' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Generate admission number
      const admNo = `ADM${Date.now()}`;

      // Create student
      const studentResult = await client.query(
        `INSERT INTO students (first_name, last_name, date_of_birth, gender, email, phone, address, 
          guardian_name, guardian_phone, guardian_email, guardian_relation, admission_number, admission_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
        [first_name, last_name, date_of_birth, gender, email, phone, address,
         guardian_name, guardian_phone, guardian_email, guardian_relation, admNo, admission_date || new Date()]
      );

      const studentId = studentResult.rows[0].id;

      // Create enrollment
      const enrollmentResult = await client.query(
        `INSERT INTO enrollments (student_id, standard_id, division_id, academic_session_id, status, enrolled_at)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [studentId, standard_id, division_id || null, academic_session_id, 'pending', new Date()]
      );

      await client.query('COMMIT');

      res.status(201).json({
        ...enrollmentResult.rows[0],
        admission_number: admNo,
        student: { id: studentId, first_name, last_name }
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error creating enrollment:', err);
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
});

// Update enrollment status
router.patch('/:id/status', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'enrolled', 'transferred', 'dropped'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      `UPDATE enrollments SET status = $1, remarks = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status, remarks, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating enrollment status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Re-enroll student for new academic session
router.post('/reenroll', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { student_id, academic_session_id, standard_id, division_id } = req.body;

    if (!student_id || !academic_session_id || !standard_id) {
      return res.status(400).json({ error: 'Student, session, and standard are required' });
    }

    // Check if already enrolled
    const existing = await pool.query(
      `SELECT id FROM enrollments WHERE student_id = $1 AND academic_session_id = $2`,
      [student_id, academic_session_id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Student already enrolled for this session' });
    }

    const result = await pool.query(
      `INSERT INTO enrollments (student_id, standard_id, division_id, academic_session_id, status, enrolled_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [student_id, standard_id, division_id || null, academic_session_id, 'pending', new Date()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error re-enrolling student:', err);
    res.status(500).json({ error: 'Failed to re-enroll student' });
  }
});

// Delete enrollment
router.delete('/:id', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM enrollments WHERE id = $1', [id]);
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (err) {
    console.error('Error deleting enrollment:', err);
    res.status(500).json({ error: 'Failed to delete enrollment' });
  }
});

export default router;