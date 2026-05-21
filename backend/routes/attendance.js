import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, auditLog } from '../middleware/auth.js';

const router = express.Router();

// Get attendance records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      student_id,
      division_id,
      subject_id,
      date,
      date_from,
      date_to,
      academic_session_id
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (student_id) {
      whereConditions.push(`a.student_id = $${paramIndex}`);
      params.push(student_id);
      paramIndex++;
    }

    if (division_id) {
      whereConditions.push(`a.division_id = $${paramIndex}`);
      params.push(division_id);
      paramIndex++;
    }

    if (subject_id) {
      whereConditions.push(`a.subject_id = $${paramIndex}`);
      params.push(subject_id);
      paramIndex++;
    }

    if (date) {
      whereConditions.push(`a.date = $${paramIndex}`);
      params.push(date);
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
      paramIndex++;
    }

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

    params.push(limit, offset);

    const attendanceResult = await pool.query(attendanceQuery, params);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM attendance a
      ${whereClause}
    `;

    const countParams = params.slice(0, -2);
    const countResult = await pool.query(countQuery, countParams);

    res.json({
      attendance: attendanceResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Mark attendance for a class
router.post('/mark', authenticateToken, authorizeRoles('admin', 'teacher'), auditLog, async (req, res) => {
  try {
    const {
      division_id,
      subject_id,
      teacher_id,
      date,
      academic_session_id,
      attendance_records // Array of {student_id, status, remarks}
    } = req.body;

    if (!division_id || !subject_id || !date || !attendance_records) {
      return res.status(400).json({ error: 'Division, subject, date, and attendance records are required' });
    }

    // Get current academic session if not provided
    let sessionId = academic_session_id;
    if (!sessionId) {
      const sessionResult = await pool.query('SELECT id FROM academic_sessions WHERE is_active = true LIMIT 1');
      if (sessionResult.rows.length > 0) {
        sessionId = sessionResult.rows[0].id;
      }
    }

    // Get current teacher if not provided
    let currentTeacherId = teacher_id;
    if (!currentTeacherId && req.user.role === 'teacher') {
      const teacherResult = await pool.query('SELECT id FROM teachers WHERE user_id = $1', [req.user.id]);
      if (teacherResult.rows.length > 0) {
        currentTeacherId = teacherResult.rows[0].id;
      }
    }

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Delete existing attendance for this date/class/subject
      await client.query(
        'DELETE FROM attendance WHERE division_id = $1 AND subject_id = $2 AND date = $3',
        [division_id, subject_id, date]
      );

      // Insert new attendance records
      const values = attendance_records.map(record =>
        `('${record.student_id}', '${division_id}', '${subject_id}', '${currentTeacherId}', '${date}', '${record.status}', '${record.remarks || ''}', '${sessionId}')`
      ).join(', ');

      const insertQuery = `
        INSERT INTO attendance (student_id, division_id, subject_id, teacher_id, date, status, remarks, academic_session_id)
        VALUES ${values}
      `;

      await client.query(insertQuery);

      await client.query('COMMIT');

      res.json({ message: 'Attendance marked successfully' });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// Get attendance for a specific student
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subject_id, date_from, date_to, academic_session_id } = req.query;

    let whereConditions = ['a.student_id = $1'];
    let params = [studentId];
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
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

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
      WHERE ${whereClause}
      ORDER BY a.date DESC
    `;

    const result = await pool.query(query, params);

    // Calculate attendance statistics
    const totalDays = result.rows.length;
    const presentDays = result.rows.filter(r => r.status === 'present').length;
    const absentDays = result.rows.filter(r => r.status === 'absent').length;
    const lateDays = result.rows.filter(r => r.status === 'late').length;

    const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays * 0.5) / totalDays * 100).toFixed(2) : 0;

    res.json({
      attendance: result.rows,
      statistics: {
        total_days: totalDays,
        present_days: presentDays,
        absent_days: absentDays,
        late_days: lateDays,
        attendance_percentage: attendancePercentage
      }
    });

  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch student attendance' });
  }
});

// Get attendance statistics for a division
router.get('/stats/division/:divisionId', authenticateToken, async (req, res) => {
  try {
    const { divisionId } = req.params;
    const { date_from, date_to, academic_session_id } = req.query;

    let whereConditions = ['a.division_id = $1'];
    let params = [divisionId];
    let paramIndex = 2;

    if (date_from && date_to) {
      whereConditions.push(`a.date BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
      params.push(date_from, date_to);
      paramIndex += 2;
    }

    if (academic_session_id) {
      whereConditions.push(`a.academic_session_id = $${paramIndex}`);
      params.push(academic_session_id);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    const statsQuery = `
      SELECT
        COUNT(*) as total_records,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count,
        COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count,
        COUNT(DISTINCT student_id) as total_students,
        COUNT(DISTINCT date) as total_days
      FROM attendance a
      WHERE ${whereClause}
    `;

    const result = await pool.query(statsQuery, params);
    const stats = result.rows[0];

    const attendanceRate = stats.total_records > 0 ?
      (((stats.present_count + stats.late_count * 0.5) / stats.total_records) * 100).toFixed(2) : 0;

    res.json({
      stats: {
        ...stats,
        attendance_rate: attendanceRate
      }
    });

  } catch (error) {
    console.error('Get division attendance stats error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance statistics' });
  }
});

// Update individual attendance record
router.put('/:id', authenticateToken, authorizeRoles('admin', 'teacher'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const query = `
      UPDATE attendance
      SET status = $1, remarks = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;

    const result = await pool.query(query, [status, remarks, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.json({
      message: 'Attendance updated successfully',
      attendance: result.rows[0]
    });

  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
});

export default router;