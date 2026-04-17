import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Notification Type Enum
 */
export enum NotificationType {
  SYSTEM = 'system',
  AD_APPROVED = 'ad_approved',
  AD_REJECTED = 'ad_rejected',
  PAYMENT_VERIFIED = 'payment_verified',
  PAYMENT_REJECTED = 'payment_rejected',
  AD_PUBLISHED = 'ad_published',
  AD_EXPIRED = 'ad_expired',
}

/**
 * Notification Interface
 */
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  relatedId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Notification Schema
 */
const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    actionUrl: {
      type: String,
      trim: true,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ type: 1 });

const NotificationModel: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default NotificationModel;
