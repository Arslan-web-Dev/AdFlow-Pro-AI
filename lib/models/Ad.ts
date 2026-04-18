import mongoose, { Schema, Model } from 'mongoose';

export type AdStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'expired';

export type AdPriority = 'basic' | 'standard' | 'premium';

export interface IAdMedia {
  url: string;
  type: 'image' | 'video';
  order: number;
}

export interface IAd {
  _id: string;
  userId: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  city: string;
  price: number;
  currency: string;
  status: AdStatus;
  priority: AdPriority;
  tags: string[];
  media: IAdMedia[];
  contactInfo: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  // Workflow tracking
  publishedAt?: Date;
  expiresAt?: Date;
  rejectionReason?: string;
  // AI generated flag
  isAIGenerated: boolean;
  // Analytics
  views: number;
  clicks: number;
  // Moderation
  moderatedBy?: string;
  moderatedAt?: Date;
  moderationNote?: string;
  // Payment
  paymentStatus: 'pending' | 'verified' | 'not_required';
  paymentProofUrl?: string;
  paymentVerifiedAt?: Date;
  paymentVerifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IAdMedia>({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  order: { type: Number, default: 0 },
});

const AdSchema = new Schema<IAd>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
      index: true,
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
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected', 'published', 'expired'],
      default: 'draft',
      index: true,
    },
    priority: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      default: 'basic',
    },
    tags: {
      type: [String],
      default: [],
    },
    media: {
      type: [MediaSchema],
      default: [],
    },
    contactInfo: {
      email: String,
      phone: String,
      whatsapp: String,
    },
    publishedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    isAIGenerated: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    moderatedBy: {
      type: String,
      ref: 'User',
    },
    moderatedAt: {
      type: Date,
    },
    moderationNote: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'verified', 'not_required'],
      default: 'pending',
    },
    paymentProofUrl: {
      type: String,
    },
    paymentVerifiedAt: {
      type: Date,
    },
    paymentVerifiedBy: {
      type: String,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
AdSchema.index({ status: 1, createdAt: -1 });
AdSchema.index({ category: 1, status: 1 });
AdSchema.index({ city: 1, status: 1 });
AdSchema.index({ priority: 1, createdAt: -1 });

const Ad: Model<IAd> = mongoose.models.Ad || mongoose.model<IAd>('Ad', AdSchema);

export default Ad;
