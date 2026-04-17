import notificationRepository from '../repositories/notification.repository';
import { NotificationType } from '../../models/notification.model';

/**
 * Notification Service
 * Handles notification-related business logic
 */
export class NotificationService {
  /**
   * Create notification
   */
  public async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    relatedId?: string;
  }) {
    try {
      const notification = await notificationRepository.createNotification({
        userId: data.userId as any,
        type: data.type,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl,
        relatedId: data.relatedId as any,
      });

      return { success: true, notification };
    } catch (error) {
      console.error('Create notification error:', error);
      return { success: false, error: 'Failed to create notification' };
    }
  }

  /**
   * Get user's notifications
   */
  public async getUserNotifications(userId: string) {
    try {
      const notifications = await notificationRepository.findByUserId(userId);
      return { success: true, notifications };
    } catch (error) {
      console.error('Get user notifications error:', error);
      return { success: false, error: 'Failed to fetch notifications' };
    }
  }

  /**
   * Get unread notifications for user
   */
  public async getUnreadNotifications(userId: string) {
    try {
      const notifications = await notificationRepository.findUnreadByUserId(userId);
      return { success: true, notifications };
    } catch (error) {
      console.error('Get unread notifications error:', error);
      return { success: false, error: 'Failed to fetch notifications' };
    }
  }

  /**
   * Mark notification as read
   */
  public async markAsRead(notificationId: string) {
    try {
      const notification = await notificationRepository.markAsRead(notificationId);
      return { success: true, notification };
    } catch (error) {
      console.error('Mark notification as read error:', error);
      return { success: false, error: 'Failed to mark notification as read' };
    }
  }

  /**
   * Mark all notifications as read for user
   */
  public async markAllAsRead(userId: string) {
    try {
      await notificationRepository.markAllAsReadForUser(userId);
      return { success: true };
    } catch (error) {
      console.error('Mark all as read error:', error);
      return { success: false, error: 'Failed to mark all notifications as read' };
    }
  }

  /**
   * Count unread notifications for user
   */
  public async countUnread(userId: string) {
    try {
      const count = await notificationRepository.countUnreadByUserId(userId);
      return { success: true, count };
    } catch (error) {
      console.error('Count unread error:', error);
      return { success: false, error: 'Failed to count unread notifications' };
    }
  }

  /**
   * Delete notification
   */
  public async deleteNotification(notificationId: string) {
    try {
      const result = await notificationRepository.deleteNotification(notificationId);
      return { success: true, result };
    } catch (error) {
      console.error('Delete notification error:', error);
      return { success: false, error: 'Failed to delete notification' };
    }
  }

  /**
   * Send system alert (Admin only)
   */
  public async sendSystemAlert(data: {
    title: string;
    message: string;
    targetUsers?: string[];
  }) {
    try {
      // If target users specified, send only to them
      if (data.targetUsers && data.targetUsers.length > 0) {
        for (const userId of data.targetUsers) {
          await this.createNotification({
            userId,
            type: NotificationType.SYSTEM,
            title: data.title,
            message: data.message,
          });
        }
      } else {
        // In production, this would send to all users
        // For now, we'll just log it
        console.log('System alert would be sent to all users:', data);
      }

      return { success: true };
    } catch (error) {
      console.error('Send system alert error:', error);
      return { success: false, error: 'Failed to send system alert' };
    }
  }
}

export default new NotificationService();
