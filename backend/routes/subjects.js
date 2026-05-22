import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { academic_session_id } = req.query;
    let query = 'SELECT * FROM subjects';
    const params = [];
    if (academic_session_id) {
      query += ' WHERE academic_session_id = $1';
      params.push(academic_session_id);
    }
    query += ' ORDER BY name';
    const result = await pool.query(query, params);
    res.json({ subjects: result.rows, total: result.rows.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, code, description, academic_session_id } = req.body;
    if (!name || !code) return res.status(400).json({ error: 'Name and code are required' });
    const result = await pool.query(
      'INSERT INTO subjects (name, code, description, academic_session_id) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, code, description || null, academic_session_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Subject code already exists' });
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

export default router;
