import mongoose, { Schema, Model } from 'mongoose';

export interface IAdMedia {
  _id: string;
  adId: string;
  sourceType: 'youtube' | 'image' | 'cloudinary' | 'other';
  originalUrl: string;
  thumbnailUrl: string;
  validationStatus: 'valid' | 'invalid' | 'pending';
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdMediaSchema = new Schema<IAdMedia>(
  {
    adId: {
      type: String,
      required: true,
    },
    sourceType: {
      type: String,
      enum: ['youtube', 'image', 'cloudinary', 'other'],
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    validationStatus: {
      type: String,
      enum: ['valid', 'invalid', 'pending'],
      default: 'pending',
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const AdMedia: Model<IAdMedia> = mongoose.models.AdMedia || mongoose.model<IAdMedia>('AdMedia', AdMediaSchema);

export default AdMedia;
