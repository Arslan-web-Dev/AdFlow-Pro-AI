import BaseRepository from './base.repository';
import NotificationModel, { INotification, NotificationType } from '../../models/notification.model';
import supabaseSync from './supabase-sync.repository';
import { syncTables } from '../config/supabase.config';

/**
 * Notification Repository
 * Handles all notification-related database operations
 */
export class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super(NotificationModel);
  }

  /**
   * Find notifications by user ID
   */
  public async findByUserId(userId: string): Promise<INotification[]> {
    return this.find({ userId }, { sort: { createdAt: -1 } });
  }

  /**
   * Find unread notifications by user ID
   */
  public async findUnreadByUserId(userId: string): Promise<INotification[]> {
    return this.find({ userId, isRead: false }, { sort: { createdAt: -1 } });
  }

  /**
   * Find notifications by type
   */
  public async findByType(type: NotificationType): Promise<INotification[]> {
    return this.find({ type });
  }

  /**
   * Mark notification as read
   */
  public async markAsRead(notificationId: string): Promise<INotification | null> {
    const notification = await this.updateById(notificationId, { isRead: true });
    
    if (notification) {
      // Sync to Supabase
      await supabaseSync.syncRecord(syncTables[3], notification.toJSON(), 'update');
    }
    
    return notification;
  }

  /**
   * Mark all notifications as read for a user
   */
  public async markAllAsReadForUser(userId: string): Promise<void> {
    await this.updateMany({ userId }, { isRead: true });
  }

  /**
   * Count unread notifications for user
   */
  public async countUnreadByUserId(userId: string): Promise<number> {
    return this.count({ userId, isRead: false });
  }

  /**
   * Create notification with sync
   */
  public async createNotification(data: Partial<INotification>): Promise<INotification> {
    const notification = await this.create(data);
    
    // Sync to Supabase
    await supabaseSync.syncRecord(syncTables[3], notification.toJSON(), 'create');
    
    return notification;
  }

  /**
   * Delete notification with sync
   */
  public async deleteNotification(notificationId: string): Promise<boolean> {
    const notification = await this.findById(notificationId);
    if (!notification) return false;

    const result = await this.deleteById(notificationId);
    
    if (result) {
      // Sync deletion to Supabase
      await supabaseSync.syncRecord(syncTables[3], { id: notification._id.toString() }, 'delete');
    }
    
    return result;
  }

  /**
   * Update many notifications (helper method)
   */
  private async updateMany(filter: any, update: any): Promise<void> {
    await this.model.updateMany(filter, update).exec();
  }
}

export default new NotificationRepository();
