import mongoose, { Schema, Model } from 'mongoose';

export interface IPackage {
  _id: string;
  name: string;
  durationDays: number;
  weight: number;
  isFeatured: boolean;
  homepageVisibility: boolean;
  autoRefreshDays?: number;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    homepageVisibility: {
      type: Boolean,
      default: false,
    },
    autoRefreshDays: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    features: [{
      type: String,
    }],
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
