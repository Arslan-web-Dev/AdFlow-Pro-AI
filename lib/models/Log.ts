import mongoose, { Schema, Model } from 'mongoose';

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';
export type LogAction = 
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'ad_created'
  | 'ad_updated'
  | 'ad_deleted'
  | 'ad_submitted'
  | 'ad_approved'
  | 'ad_rejected'
  | 'ad_published'
  | 'login'
  | 'logout'
  | 'payment_processed'
  | 'ai_ad_generated'
  | 'sync_mongodb_supabase'
  | 'system_error';

export interface ILog {
  _id: string;
  level: LogLevel;
  action: LogAction;
  userId?: string;
  adId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const LogSchema = new Schema<ILog>(
  {
    level: {
      type: String,
      enum: ['info', 'warning', 'error', 'debug'],
      default: 'info',
    },
    action: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      ref: 'User',
    },
    adId: {
      type: String,
      ref: 'Ad',
    },
    details: {
      type: Object,
      default: {},
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

LogSchema.index({ createdAt: -1 });
LogSchema.index({ userId: 1, createdAt: -1 });
LogSchema.index({ action: 1, createdAt: -1 });

const Log: Model<ILog> = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);

export default Log;
