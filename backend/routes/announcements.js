import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, auditLog } from '../middleware/auth.js';

const router = express.Router();

// Get all announcements
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, priority, target_audience } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (type) {
      whereConditions.push(`a.type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }

    if (priority) {
      whereConditions.push(`a.priority = $${paramIndex}`);
      params.push(priority);
      paramIndex++;
    }

    if (target_audience) {
      whereConditions.push(`a.target_audience = $${paramIndex}`);
      params.push(target_audience);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT a.*, u.email as created_by_email
      FROM announcements a
      JOIN users u ON a.created_by = u.id
      ${whereClause}
      ORDER BY a.is_pinned DESC, a.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const countQuery = `SELECT COUNT(*) FROM announcements a ${whereClause}`;
    
    const [result, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, -2))
    ]);

    res.json({
      announcements: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Create announcement
router.post('/', authenticateToken, authorizeRoles('admin', 'teacher'), auditLog, async (req, res) => {
  try {
    const { title, content, type, priority, target_audience, target_division_id, is_pinned, publish_at, expires_at } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await pool.query(
      `INSERT INTO announcements (title, content, type, priority, target_audience, target_division_id, is_pinned, publish_at, expires_at, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [title, content, type || 'general', priority || 'normal', target_audience || 'all', 
       target_division_id, is_pinned || false, publish_at || new Date(), expires_at, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Update announcement
router.put('/:id', authenticateToken, authorizeRoles('admin', 'teacher'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, priority, is_pinned, expires_at } = req.body;

    const result = await pool.query(
      `UPDATE announcements SET title = COALESCE($1, title), content = COALESCE($2, content),
       type = COALESCE($3, type), priority = COALESCE($4, priority), is_pinned = COALESCE($5, is_pinned),
       expires_at = COALESCE($6, expires_at), updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [title, content, type, priority, is_pinned, expires_at, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating announcement:', err);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// Delete announcement
router.delete('/:id', authenticateToken, authorizeRoles('admin'), auditLog, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM announcements WHERE id = $1', [id]);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    console.error('Error deleting announcement:', err);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

export default router;