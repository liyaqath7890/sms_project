import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user details from database
    const userQuery = 'SELECT id, email, role, is_active FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [decoded.id]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

const auditLog = async (req, res, next) => {
  const originalSend = res.send;
  let responseBody;

  res.send = function(data) {
    responseBody = data;
    originalSend.call(this, data);
  };

  res.on('finish', async () => {
    try {
      if (req.user && req.method !== 'GET') {
        const auditData = {
          user_id: req.user.id,
          action: `${req.method} ${req.originalUrl}`,
          table_name: req.baseUrl.split('/').pop(),
          ip_address: req.ip,
          user_agent: req.get('User-Agent'),
          created_at: new Date()
        };

        // Insert audit log (without blocking response)
        pool.query(
          'INSERT INTO audit_logs (user_id, action, table_name, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
          [auditData.user_id, auditData.action, auditData.table_name, auditData.ip_address, auditData.user_agent]
        ).catch(err => console.error('Audit log error:', err));
      }
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  });

  next();
};

export {
  authenticateToken,
  authorizeRoles,
  auditLog
};