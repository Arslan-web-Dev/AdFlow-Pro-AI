import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Payment Status Enum
 */
export enum PaymentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

/**
 * Payment Method Enum
 */
export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  CRYPTO = 'crypto',
}

/**
 * Payment Interface
 */
export interface IPayment extends Document {
  adId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionRef: string;
  proofUrl?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment Schema
 */
const PaymentSchema: Schema = new Schema(
  {
    adId: {
      type: Schema.Types.ObjectId,
      ref: 'Ad',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    transactionRef: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    proofUrl: {
      type: String,
      trim: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
PaymentSchema.index({ adId: 1 });
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ transactionRef: 1 });
PaymentSchema.index({ status: 1, createdAt: -1 });

const PaymentModel: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default PaymentModel;
