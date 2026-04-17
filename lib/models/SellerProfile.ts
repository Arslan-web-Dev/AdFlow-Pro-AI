import mongoose, { Schema, Model } from 'mongoose';

export interface ISellerProfile {
  _id: string;
  userId: string;
  displayName: string;
  businessName?: string;
  phone?: string;
  city?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SellerProfileSchema = new Schema<ISellerProfile>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
    },
    phone: {
      type: String,
    },
    city: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const SellerProfile: Model<ISellerProfile> = mongoose.models.SellerProfile || mongoose.model<ISellerProfile>('SellerProfile', SellerProfileSchema);

export default SellerProfile;
