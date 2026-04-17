import mongoose, { Schema, Model } from 'mongoose';

export type AdStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'payment_pending'
  | 'payment_submitted'
  | 'payment_verified'
  | 'scheduled'
  | 'published'
  | 'expired'
  | 'rejected';

export interface IAd {
  _id: string;
  userId: string;
  packageId: string;
  categoryId: string;
  cityId: string;
  title: string;
  slug: string;
  description: string;
  status: AdStatus;
  tags: string[];
  publishAt?: Date;
  expireAt?: Date;
  isFeatured: boolean;
  rankScore: number;
  adminBoost: number;
  verifiedSellerPoints: number;
  rejectionReason?: string;
  moderatorId?: string;
  moderationNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdSchema = new Schema<IAd>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    packageId: {
      type: String,
      required: true,
      ref: 'Package',
    },
    categoryId: {
      type: String,
      required: true,
      ref: 'Category',
    },
    cityId: {
      type: String,
      required: true,
      ref: 'City',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'payment_pending', 'payment_submitted', 'payment_verified', 'scheduled', 'published', 'expired', 'rejected'],
      default: 'draft',
    },
    tags: {
      type: [String],
      default: [],
    },
    publishAt: {
      type: Date,
    },
    expireAt: {
      type: Date,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rankScore: {
      type: Number,
      default: 0,
    },
    adminBoost: {
      type: Number,
      default: 0,
    },
    verifiedSellerPoints: {
      type: Number,
      default: 0,
    },
    rejectionReason: {
      type: String,
    },
    moderatorId: {
      type: String,
      ref: 'User',
    },
    moderationNote: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Ad: Model<IAd> = mongoose.models.Ad || mongoose.model<IAd>('Ad', AdSchema);

export default Ad;
