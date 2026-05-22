import NotificationRepository from '../repositories/NotificationRepository.js';
import { createHttpError } from '../utils/apiResponse.js';

class NotificationService {
  static async getNotifications(user, query) {
    const page = parseInt(query.page || 1, 10);
    const limit = parseInt(query.limit || 20, 10);
    const roles = user.roles?.length ? user.roles : [user.role];
    const { notifications, total } = await NotificationRepository.fetchForUser({
      userId: user.id,
      roles,
      page,
      limit,
      unreadOnly: query.unreadOnly === 'true'
    });

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async createNotification(payload, user) {
    if (!payload.title || !payload.message) {
      throw createHttpError('Title and message are required', 400);
    }

    return NotificationRepository.create({
      ...payload,
      created_by: user.id
    });
  }

  static async markAsRead(notificationId, userId) {
    await NotificationRepository.markAsRead(notificationId, userId);
    return { message: 'Notification marked as read' };
  }

  static async markAllAsRead(user) {
    const roles = user.roles?.length ? user.roles : [user.role];
    await NotificationRepository.markAllAsRead(user.id, roles);
    return { message: 'All notifications marked as read' };
  }
}

export default NotificationService;
