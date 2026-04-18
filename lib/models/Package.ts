import mongoose, { Schema, Model } from 'mongoose';

export type PackageType = 'basic' | 'standard' | 'premium';

export interface IPackage {
  _id: string;
  type: PackageType;
  name: string;
  description: string;
  durationDays: number;
  price: number;
  currency: string;
  features: string[];
  isFeatured: boolean;
  priorityWeight: number;
  maxImages: number;
  analyticsEnabled: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    type: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
      default: 30,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    features: [{
      type: String,
    }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    priorityWeight: {
      type: Number,
      default: 0,
    },
    maxImages: {
      type: Number,
      default: 5,
    },
    analyticsEnabled: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Package: Model<IPackage> = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);

export default Package;

// Default packages
export const defaultPackages: Omit<IPackage, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    type: 'basic',
    name: 'Basic',
    description: 'Perfect for casual sellers',
    durationDays: 30,
    price: 0,
    currency: 'USD',
    features: ['30-day listing', 'Standard visibility', 'Up to 3 images', 'Email support'],
    isFeatured: false,
    priorityWeight: 1,
    maxImages: 3,
    analyticsEnabled: false,
    isActive: true,
  },
  {
    type: 'standard',
    name: 'Standard',
    description: 'Great for regular sellers',
    durationDays: 30,
    price: 9.99,
    currency: 'USD',
    features: ['30-day listing', 'Priority visibility', 'Up to 8 images', 'Priority support', 'Basic analytics'],
    isFeatured: true,
    priorityWeight: 2,
    maxImages: 8,
    analyticsEnabled: true,
    isActive: true,
  },
  {
    type: 'premium',
    name: 'Premium',
    description: 'Maximum exposure for professionals',
    durationDays: 60,
    price: 29.99,
    currency: 'USD',
    features: ['60-day listing', 'Featured placement', 'Unlimited images', 'Priority support', 'Advanced analytics', 'Homepage highlight'],
    isFeatured: true,
    priorityWeight: 3,
    maxImages: 20,
    analyticsEnabled: true,
    isActive: true,
  },
];
