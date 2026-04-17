import mongoose, { Schema, Model } from 'mongoose';

export interface ICity {
  _id: string;
  name: string;
  slug: string;
  country?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CitySchema = new Schema<ICity>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
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

const City: Model<ICity> = mongoose.models.City || mongoose.model<ICity>('City', CitySchema);

export default City;
