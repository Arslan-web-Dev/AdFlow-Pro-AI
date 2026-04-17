import mongoose, { Schema, Model } from 'mongoose';

export interface IAdStatusHistory {
  _id: string;
  adId: string;
  previousStatus: string;
  newStatus: string;
  changedBy: string;
  changedByRole: string;
  note?: string;
  createdAt: Date;
}

const AdStatusHistorySchema = new Schema<IAdStatusHistory>(
  {
    adId: {
      type: String,
      required: true,
    },
    previousStatus: {
      type: String,
      required: true,
    },
    newStatus: {
      type: String,
      required: true,
    },
    changedBy: {
      type: String,
      required: true,
    },
    changedByRole: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const AdStatusHistory: Model<IAdStatusHistory> = mongoose.models.AdStatusHistory || mongoose.model<IAdStatusHistory>('AdStatusHistory', AdStatusHistorySchema);

export default AdStatusHistory;
