import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Analytics Interface
 */
export interface IAnalytics extends Document {
  adId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  impressions: number;
  clicks: number;
  ctr: number; // Click-through rate
  revenue: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Analytics Schema
 */
const AnalyticsSchema: Schema = new Schema(
  {
    adId: {
      type: Schema.Types.ObjectId,
      ref: 'Ad',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
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
    ctr: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    revenue: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
AnalyticsSchema.index({ adId: 1, date: -1 });
AnalyticsSchema.index({ userId: 1, date: -1 });
AnalyticsSchema.index({ date: -1 });
AnalyticsSchema.index({ adId: 1, userId: 1, date: -1 });

const AnalyticsModel: Model<IAnalytics> = mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

export default AnalyticsModel;
