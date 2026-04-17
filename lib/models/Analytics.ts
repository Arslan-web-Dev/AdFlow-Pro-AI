import mongoose, { Schema, Model } from 'mongoose';

export interface IAnalytics {
  _id: string;
  date: Date;
  totalUsers: number;
  totalAds: number;
  activeAds: number;
  pendingAds: number;
  totalRevenue: number;
  dailyRevenue: number;
  newUsers: number;
  newAds: number;
  adsByStatus: Record<string, number>;
  adsByCategory: Record<string, number>;
  usersByRole: Record<string, number>;
  aiGeneratedAds: number;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    totalUsers: {
      type: Number,
      default: 0,
    },
    totalAds: {
      type: Number,
      default: 0,
    },
    activeAds: {
      type: Number,
      default: 0,
    },
    pendingAds: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    dailyRevenue: {
      type: Number,
      default: 0,
    },
    newUsers: {
      type: Number,
      default: 0,
    },
    newAds: {
      type: Number,
      default: 0,
    },
    adsByStatus: {
      type: Object,
      default: {},
    },
    adsByCategory: {
      type: Object,
      default: {},
    },
    usersByRole: {
      type: Object,
      default: {},
    },
    aiGeneratedAds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

AnalyticsSchema.index({ date: -1 });

const Analytics: Model<IAnalytics> = mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

export default Analytics;
