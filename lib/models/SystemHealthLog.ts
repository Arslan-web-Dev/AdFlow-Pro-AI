import mongoose, { Schema, Model } from 'mongoose';

export interface ISystemHealthLog {
  _id: string;
  source: string;
  responseMs?: number;
  status: 'healthy' | 'degraded' | 'down';
  errorMessage?: string;
  checkedAt: Date;
}

const SystemHealthLogSchema = new Schema<ISystemHealthLog>(
  {
    source: {
      type: String,
      required: true,
    },
    responseMs: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['healthy', 'degraded', 'down'],
      required: true,
    },
    errorMessage: {
      type: String,
    },
    checkedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const SystemHealthLog: Model<ISystemHealthLog> = mongoose.models.SystemHealthLog || mongoose.model<ISystemHealthLog>('SystemHealthLog', SystemHealthLogSchema);

export default SystemHealthLog;
