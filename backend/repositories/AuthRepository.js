import crypto from 'crypto';
import pool from '../config/database.js';
import { normalizeRole, permissionsForRoles } from '../config/rbac.js';

const tableMissing = (error) => error?.code === '42P01' || error?.code === '42703';
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

class AuthRepository {
  static async findUserByEmail(email) {
    const result = await pool.query(
      `SELECT id, email, password_hash, role, is_active, created_at, updated_at
       FROM users
       WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    return result.rows[0] || null;
  }

  static async findUserById(id) {
    const result = await pool.query(
      `SELECT id, email, role, is_active, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    const user = result.rows[0];
    if (!user) {
      return null;
    }

    const roles = await AuthRepository.getUserRoles(user.id, user.role);
    const permissions = await AuthRepository.getUserPermissions(user.id, roles);

    return {
      ...user,
      role: normalizeRole(user.role),
      roles,
      permissions
    };
  }

  static async getUserRoles(userId, fallbackRole) {
    try {
      const result = await pool.query(
        `SELECT r.slug
         FROM user_roles ur
         JOIN roles r ON r.id = ur.role_id
         WHERE ur.user_id = $1 AND r.is_active = true`,
        [userId]
      );

      const roles = result.rows.map((row) => normalizeRole(row.slug));
      return roles.length > 0 ? roles : [normalizeRole(fallbackRole)];
    } catch (error) {
      if (tableMissing(error)) {
        return [normalizeRole(fallbackRole)];
      }
      throw error;
    }
  }

  static async getUserPermissions(userId, fallbackRoles) {
    try {
      const result = await pool.query(
        `SELECT DISTINCT p.slug
         FROM user_roles ur
         JOIN role_permissions rp ON rp.role_id = ur.role_id
         JOIN permissions p ON p.id = rp.permission_id
         WHERE ur.user_id = $1`,
        [userId]
      );

      const permissions = result.rows.map((row) => row.slug);
      return permissions.length > 0 ? permissions : permissionsForRoles(fallbackRoles);
    } catch (error) {
      if (tableMissing(error)) {
        return permissionsForRoles(fallbackRoles);
      }
      throw error;
    }
  }

  static async createUserWithProfile({ email, passwordHash, role, firstName, lastName, userData }) {
    const client = await pool.connect();
    const normalizedRole = normalizeRole(role);

    try {
      await client.query('BEGIN');

      const userResult = await client.query(
        'INSERT INTO users (email, password_hash, role, is_active) VALUES ($1, $2, $3, true) RETURNING id, email, role',
        [email, passwordHash, normalizedRole]
      );

      const user = userResult.rows[0];

      if (normalizedRole === 'student') {
        await client.query(
          `INSERT INTO students (user_id, first_name, last_name, admission_number, date_of_birth)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            user.id,
            firstName || '',
            lastName || '',
            userData.admission_number || `ADM${Date.now()}`,
            userData.date_of_birth || '2000-01-01'
          ]
        );
      } else if (normalizedRole === 'teacher') {
        await client.query(
          `INSERT INTO teachers (user_id, first_name, last_name, employee_id, date_of_birth)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            user.id,
            firstName || '',
            lastName || '',
            userData.employee_id || `EMP${Date.now()}`,
            userData.date_of_birth || '1980-01-01'
          ]
        );
      }

      await client.query('COMMIT');
      try {
        await pool.query(
          `INSERT INTO user_roles (user_id, role_id)
           SELECT $1, id FROM roles WHERE slug = $2
           ON CONFLICT DO NOTHING`,
          [user.id, normalizedRole]
        );
      } catch (error) {
        if (!tableMissing(error)) {
          throw error;
        }
      }

      return AuthRepository.findUserById(user.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async updatePassword(userId, passwordHash) {
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, userId]
    );
  }

  static async createRefreshSession({ userId, refreshToken, expiresAt, ipAddress, userAgent }) {
    try {
      const result = await pool.query(
        `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [userId, hashToken(refreshToken), expiresAt, ipAddress, userAgent]
      );

      return result.rows[0];
    } catch (error) {
      if (tableMissing(error)) {
        return null;
      }
      throw error;
    }
  }

  static async findRefreshSession(refreshToken) {
    try {
      const result = await pool.query(
        `SELECT rt.*, u.email, u.role, u.is_active
         FROM refresh_tokens rt
         JOIN users u ON u.id = rt.user_id
         WHERE rt.token_hash = $1 AND rt.revoked_at IS NULL AND rt.expires_at > NOW()`,
        [hashToken(refreshToken)]
      );

      return result.rows[0] || null;
    } catch (error) {
      if (tableMissing(error)) {
        return null;
      }
      throw error;
    }
  }

  static async revokeRefreshSession(refreshToken) {
    try {
      await pool.query(
        'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1',
        [hashToken(refreshToken)]
      );
    } catch (error) {
      if (!tableMissing(error)) {
        throw error;
      }
    }
  }

  static async revokeUserSessions(userId) {
    try {
      await pool.query(
        'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL',
        [userId]
      );
    } catch (error) {
      if (!tableMissing(error)) {
        throw error;
      }
    }
  }

  static async createPasswordResetToken(userId, token, expiresAt) {
    try {
      await pool.query(
        `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
         VALUES ($1, $2, $3)`,
        [userId, hashToken(token), expiresAt]
      );
    } catch (error) {
      if (!tableMissing(error)) {
        throw error;
      }
    }
  }

  static async consumePasswordResetToken(token) {
    try {
      const result = await pool.query(
        `UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
         RETURNING user_id`,
        [hashToken(token)]
      );

      return result.rows[0] || null;
    } catch (error) {
      if (tableMissing(error)) {
        return null;
      }
      throw error;
    }
  }

  static async createEmailVerificationToken(userId, token, expiresAt) {
    try {
      await pool.query(
        `INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
         VALUES ($1, $2, $3)`,
        [userId, hashToken(token), expiresAt]
      );
    } catch (error) {
      if (!tableMissing(error)) {
        throw error;
      }
    }
  }

  static async verifyEmailToken(token) {
    try {
      const result = await pool.query(
        `UPDATE email_verification_tokens
         SET used_at = NOW()
         WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
         RETURNING user_id`,
        [hashToken(token)]
      );

      const tokenRow = result.rows[0];
      if (!tokenRow) {
        return null;
      }

      await pool.query('UPDATE users SET email_verified_at = NOW(), updated_at = NOW() WHERE id = $1', [tokenRow.user_id]);
      return tokenRow;
    } catch (error) {
      if (tableMissing(error)) {
        return null;
      }
      throw error;
    }
  }

  static async logLoginActivity({ userId, email, status, ipAddress, userAgent, failureReason }) {
    try {
      await pool.query(
        `INSERT INTO login_activities (user_id, email, status, ip_address, user_agent, failure_reason)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, email, status, ipAddress, userAgent, failureReason]
      );
    } catch (error) {
      if (!tableMissing(error)) {
        console.error('Login activity log error:', error);
      }
    }
  }
}

export default AuthRepository;
