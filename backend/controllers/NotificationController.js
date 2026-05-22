import NotificationService from '../services/NotificationService.js';
import { sendSuccess } from '../utils/apiResponse.js';

class NotificationController {
  static async getNotifications(req, res, next) {
    try {
      sendSuccess(res, await NotificationService.getNotifications(req.user, req.query));
    } catch (error) {
      next(error);
    }
  }

  static async createNotification(req, res, next) {
    try {
      sendSuccess(res, { notification: await NotificationService.createNotification(req.body, req.user) }, 201);
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      sendSuccess(res, await NotificationService.markAsRead(req.params.id, req.user.id));
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req, res, next) {
    try {
      sendSuccess(res, await NotificationService.markAllAsRead(req.user));
    } catch (error) {
      next(error);
    }
  }
}

export default NotificationController;
