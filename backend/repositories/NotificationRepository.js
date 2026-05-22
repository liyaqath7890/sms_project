import pool from '../config/database.js';

class NotificationRepository {
  static async fetchForUser({ userId, roles, page, limit, unreadOnly }) {
    const offset = (page - 1) * limit;
    const params = [userId, roles, limit, offset];
    const unreadClause = unreadOnly ? 'AND nr.read_at IS NULL' : '';

    const query = `
      SELECT n.*, nr.read_at,
             COUNT(*) OVER() as total_count
      FROM notifications n
      LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = $1
      WHERE n.deleted_at IS NULL
        AND (n.expires_at IS NULL OR n.expires_at > NOW())
        AND (
          n.target_user_id = $1
          OR 'all' = ANY(n.target_roles)
          OR n.target_roles && $2::text[]
        )
        ${unreadClause}
      ORDER BY n.created_at DESC
      LIMIT $3 OFFSET $4
    `;

    const result = await pool.query(query, params);
    const total = result.rows[0]?.total_count ? parseInt(result.rows[0].total_count, 10) : 0;

    return {
      notifications: result.rows.map(({ total_count, ...row }) => row),
      total
    };
  }

  static async create({ title, message, type, priority, target_roles, target_user_id, action_url, expires_at, created_by }) {
    const result = await pool.query(
      `INSERT INTO notifications (title, message, type, priority, target_roles, target_user_id, action_url, expires_at, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        title,
        message,
        type || 'info',
        priority || 'normal',
        target_roles || ['all'],
        target_user_id || null,
        action_url || null,
        expires_at || null,
        created_by
      ]
    );

    return result.rows[0];
  }

  static async markAsRead(notificationId, userId) {
    await pool.query(
      `INSERT INTO notification_reads (notification_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (notification_id, user_id) DO UPDATE SET read_at = NOW()`,
      [notificationId, userId]
    );
  }

  static async markAllAsRead(userId, roles) {
    await pool.query(
      `INSERT INTO notification_reads (notification_id, user_id)
       SELECT n.id, $1
       FROM notifications n
       WHERE n.deleted_at IS NULL
         AND (n.target_user_id = $1 OR 'all' = ANY(n.target_roles) OR n.target_roles && $2::text[])
       ON CONFLICT (notification_id, user_id) DO UPDATE SET read_at = NOW()`,
      [userId, roles]
    );
  }
}

export default NotificationRepository;
