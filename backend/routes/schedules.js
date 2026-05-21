import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, auditLog } from '../middleware/auth.js';

const router = express.Router();

// Get all schedules
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { division_id, day_of_week, teacher_id, academic_session_id } = req.query;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (division_id) {
      whereConditions.push(`s.division_id = $${paramIndex}`);
      params.push(division_id);
      paramIndex++;
    }

    if (day_of_week) {
      whereConditions.push(`s.day_of_week = $${paramIndex}`);
      params.push(day_of_week);
      paramIndex++;
    }

    if (teacher_id) {
      whereConditions.push(`s.teacher_id = $${paramIndex}`);
      params.push(teacher_id);
      paramIndex++;
    }

    if (academic_session_id) {
      whereConditions.push(`s.academic_session_id = $${paramIndex}`);
      params.push(academic_session_id);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT s.*, c.name as course_name, c.code as course_code,
             t.first_name as teacher_first_name, t.last_name as teacher_last_name,
             d.name as division_name, d.section as division_section
      FROM schedules s
      JOIN courses c ON s.course_id = c.id
      JOIN teachers t ON s.teacher_id = t.id
      JOIN divisions d ON s.division_id = d.id
      ${whereClause}
      ORDER BY s.day_of_week, s.period_number
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching schedules:', err);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Get timetable for a division
router.get('/timetable/:divisionId', authenticateToken, async (req, res) => {
  try {
    const { divisionId } = req.params;
    const { academic_session_id } = req.query;

    const query = `
      SELECT s.*, c.name as course_name, c.code as course_code,
             t.first_name as teacher_first_name, t.last_name as teacher_last_name
      FROM schedules s
      JOIN courses c ON s.course_id = c.id
      JOIN teachers t ON s.teacher_id = t.id
      WHERE s.division_id = $1
      ${academic_session_id ? 'AND s.academic_session_id = $2' : ''}
      ORDER BY s.day_of_week, s.period_number
    `;

    const params = academic_session_id ? [divisionId, academic_session_id] : [divisionId];
    const result = await pool.query(query, params);

    // Group by day
    const timetable = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    days.forEach(day => {
      timetable[day] = result.rows.filter(s => s.day_of_week === day)
        .sort((a, b) => a.period_number - b.period_number);
    });

    res.json(timetable);
  } catch (err) {
    console.error('Error fetching timetable:', err);
    res.status(500).json({ error: 'Failed to fetch timetable' });
  }
});

// Create schedule
router.post('/', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { division_id, course_id, teacher_id, day_of_week, period_number, academic_session_id, room } = req.body;

    if (!division_id || !course_id || !teacher_id || !day_of_week || !period_number) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for conflicts
    const conflictQuery = `
      SELECT s.*, c.name as course_name, t.first_name, t.last_name
      FROM schedules s
      JOIN courses c ON s.course_id = c.id
      JOIN teachers t ON s.teacher_id = t.id
      WHERE s.division_id = $1 AND s.day_of_week = $2 AND s.period_number = $3
      ${academic_session_id ? 'AND s.academic_session_id = $4' : ''}
    `;
    
    const conflictParams = academic_session_id ? 
      [division_id, day_of_week, period_number, academic_session_id] : 
      [division_id, day_of_week, period_number];
    
    const conflict = await pool.query(conflictQuery, conflictParams);
    
    if (conflict.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Schedule conflict exists',
        conflicting: conflict.rows[0]
      });
    }

    const result = await pool.query(
      `INSERT INTO schedules (division_id, course_id, teacher_id, day_of_week, period_number, academic_session_id, room)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [division_id, course_id, teacher_id, day_of_week, period_number, academic_session_id, room]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating schedule:', err);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

// Bulk create schedule
router.post('/bulk', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { schedules } = req.body;

    if (!Array.isArray(schedules) || schedules.length === 0) {
      return res.status(400).json({ error: 'Schedules array is required' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const created = [];
      const conflicts = [];

      for (const schedule of schedules) {
        const { division_id, course_id, teacher_id, day_of_week, period_number, academic_session_id, room } = schedule;
        
        const conflict = await client.query(
          `SELECT id FROM schedules WHERE division_id = $1 AND day_of_week = $2 AND period_number = $3
           AND academic_session_id = $4`,
          [division_id, day_of_week, period_number, academic_session_id]
        );

        if (conflict.rows.length > 0) {
          conflicts.push(schedule);
          continue;
        }

        const result = await client.query(
          `INSERT INTO schedules (division_id, course_id, teacher_id, day_of_week, period_number, academic_session_id, room)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [division_id, course_id, teacher_id, day_of_week, period_number, academic_session_id, room]
        );
        created.push(result.rows[0]);
      }

      await client.query('COMMIT');
      res.json({ created, conflicts, message: `${created.length} schedules created` });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error creating bulk schedules:', err);
    res.status(500).json({ error: 'Failed to create schedules' });
  }
});

// Update schedule
router.put('/:id', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    const { course_id, teacher_id, period_number, room } = req.body;

    const result = await pool.query(
      `UPDATE schedules SET course_id = COALESCE($1, course_id), teacher_id = COALESCE($2, teacher_id),
       period_number = COALESCE($3, period_number), room = COALESCE($4, room), updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [course_id, teacher_id, period_number, room, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating schedule:', err);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});

// Delete schedule
router.delete('/:id', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM schedules WHERE id = $1', [id]);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    console.error('Error deleting schedule:', err);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

export default router;