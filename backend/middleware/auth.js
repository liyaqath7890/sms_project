import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import AuthRepository from '../repositories/AuthRepository.js';
import { normalizeRole, ROLE_HIERARCHY } from '../config/rbac.js';

const getBearerToken = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  return authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
};

const authenticateToken = async (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({ success: false, error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type && decoded.type !== 'access') {
      return res.status(401).json({ success: false, error: 'Invalid access token' });
    }

    const user = await AuthRepository.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    if (!user.is_active) {
      return res.status(401).json({ success: false, error: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired' });
    }
    next(error);
  }
};

const authorizeRoles = (...roles) => {
  const allowedRoles = roles.map(normalizeRole);
  const minimumAllowedLevel = Math.min(...allowedRoles.map((role) => ROLE_HIERARCHY[role] || 0));

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const userRoles = (req.user.roles?.length ? req.user.roles : [req.user.role]).map(normalizeRole);
    const hasExplicitRole = userRoles.some((role) => allowedRoles.includes(role));
    const hasHierarchyAccess = userRoles.some((role) => (ROLE_HIERARCHY[role] || 0) >= minimumAllowedLevel);

    if (!hasExplicitRole && !hasHierarchyAccess) {
      return res.status(403).json({ success: false, error: 'Insufficient role permissions' });
    }

    next();
  };
};

const authorizePermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = permissions.every((permission) => userPermissions.includes(permission));

    if (!hasPermission) {
      return res.status(403).json({ success: false, error: 'Insufficient module permissions' });
    }

    next();
  };
};

const auditLog = async (req, res, next) => {
  const originalSend = res.send;
  let responseBody;

  res.send = function sendWithAudit(data) {
    responseBody = data;
    originalSend.call(this, data);
  };

  res.on('finish', async () => {
    try {
      if (req.method === 'GET') {
        return;
      }

      const parsedBody = (() => {
        try {
          return typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
        } catch {
          return null;
        }
      })();

      const sanitizedBody = { ...req.body };
      for (const key of ['password', 'currentPassword', 'newPassword', 'refreshToken', 'token']) {
        if (sanitizedBody[key]) {
          sanitizedBody[key] = '[REDACTED]';
        }
      }

      await pool.query(
        `INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          req.user?.id || null,
          `${req.method} ${req.originalUrl}`,
          req.baseUrl.split('/').pop(),
          parsedBody?.id || parsedBody?.data?.id || null,
          JSON.stringify({
            statusCode: res.statusCode,
            params: req.params,
            query: req.query,
            body: sanitizedBody
          }),
          req.ip,
          req.get('User-Agent')
        ]
      );
    } catch (error) {
      if (error.code !== '42P01') {
        console.error('Audit log error:', error);
      }
    }
  });

  next();
};

export {
  authenticateToken,
  authorizeRoles,
  authorizePermissions,
  auditLog
};
