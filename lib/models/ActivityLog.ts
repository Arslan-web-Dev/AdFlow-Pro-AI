import mongoose, { Schema, Model } from 'mongoose';

export type ActivityType = 
  | 'ad_created'
  | 'ad_updated'
  | 'ad_deleted'
  | 'ad_submitted'
  | 'ad_approved'
  | 'ad_rejected'
  | 'ad_published'
  | 'ad_expired'
  | 'user_registered'
  | 'user_login'
  | 'user_updated'
  | 'payment_submitted'
  | 'payment_verified'
  | 'moderation_action';

export interface IActivityLog {
  _id: string;
  userId?: string;
  adId?: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, any>;
  performedBy?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: String,
      ref: 'User',
      index: true,
    },
    adId: {
      type: String,
      ref: 'Ad',
      index: true,
    },
    type: {
      type: String,
      enum: [
        'ad_created',
        'ad_updated',
        'ad_deleted',
        'ad_submitted',
        'ad_approved',
        'ad_rejected',
        'ad_published',
        'ad_expired',
        'user_registered',
        'user_login',
        'user_updated',
        'payment_submitted',
        'payment_verified',
        'moderation_action',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    performedBy: {
      type: String,
      ref: 'User',
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

ActivityLogSchema.index({ type: 1, createdAt: -1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ adId: 1, createdAt: -1 });

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;

export async function logActivity(data: Omit<IActivityLog, '_id' | 'createdAt'>) {
  try {
    await ActivityLog.create(data);
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
