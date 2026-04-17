import mongoose, { Schema, Model } from 'mongoose';

export interface IPayment {
  _id: string;
  adId: string;
  amount: number;
  currency?: string;
  method: string;
  transactionRef: string;
  senderName: string;
  screenshotUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    adId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    method: {
      type: String,
      required: true,
    },
    transactionRef: {
      type: String,
      required: true,
      unique: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    screenshotUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
    },
    verifiedBy: {
      type: String,
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
