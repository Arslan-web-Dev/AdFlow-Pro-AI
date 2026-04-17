import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Ad Status Enum
 */
export enum AdStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  PAYMENT_PENDING = 'payment_pending',
  PUBLISHED = 'published',
  EXPIRED = 'expired',
  REJECTED = 'rejected',
}

/**
 * Ad Interface
 */
export interface IAd extends Document {
  title: string;
  description: string;
  mediaUrl: string;
  budget: number;
  impressions: number;
  clicks: number;
  status: AdStatus;
  userId: mongoose.Types.ObjectId;
  publishedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  rejectionReason?: string;
  moderatorId?: mongoose.Types.ObjectId;
}

/**
 * Ad Schema
 */
const AdSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    impressions: {
      type: Number,
      default: 0,
      min: 0,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(AdStatus),
      default: AdStatus.DRAFT,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    moderatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
AdSchema.index({ userId: 1 });
AdSchema.index({ status: 1 });
AdSchema.index({ createdAt: -1 });
AdSchema.index({ expiresAt: 1 });
AdSchema.index({ status: 1, createdAt: -1 });

const AdModel: Model<IAd> = mongoose.models.Ad || mongoose.model<IAd>('Ad', AdSchema);

export default AdModel;
