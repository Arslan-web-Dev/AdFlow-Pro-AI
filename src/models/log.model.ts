import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Log Level Enum
 */
export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  DEBUG = 'debug',
}

/**
 * Log Action Enum
 */
export enum LogAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTER = 'register',
  AD_CREATED = 'ad_created',
  AD_UPDATED = 'ad_updated',
  AD_DELETED = 'ad_deleted',
  AD_SUBMITTED = 'ad_submitted',
  AD_APPROVED = 'ad_approved',
  AD_REJECTED = 'ad_rejected',
  AD_PUBLISHED = 'ad_published',
  PAYMENT_SUBMITTED = 'payment_submitted',
  PAYMENT_VERIFIED = 'payment_verified',
  PAYMENT_REJECTED = 'payment_rejected',
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_DELETED = 'user_deleted',
  USER_BANNED = 'user_banned',
  SYNC_FAILED = 'sync_failed',
}

/**
 * Log Interface
 */
export interface ILog extends Document {
  userId?: mongoose.Types.ObjectId;
  action: LogAction;
  level: LogLevel;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

/**
 * Log Schema
 */
const LogSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    action: {
      type: String,
      enum: Object.values(LogAction),
      required: true,
      index: true,
    },
    level: {
      type: String,
      enum: Object.values(LogLevel),
      default: LogLevel.INFO,
      index: true,
    },
    details: {
      type: Schema.Types.Mixed,
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

// Indexes for faster queries
LogSchema.index({ userId: 1, createdAt: -1 });
LogSchema.index({ action: 1, createdAt: -1 });
LogSchema.index({ level: 1, createdAt: -1 });
LogSchema.index({ createdAt: -1 });

// TTL index to automatically delete logs older than 90 days
LogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const LogModel: Model<ILog> = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);

export default LogModel;
