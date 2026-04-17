import mongoose, { Schema, Model } from 'mongoose';

export interface IAuditLog {
  _id: string;
  actorId: string;
  actorRole: string;
  actionType: string;
  targetType: string;
  targetId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: {
      type: String,
      required: true,
    },
    actorRole: {
      type: String,
      required: true,
    },
    actionType: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    oldValue: {
      type: Schema.Types.Mixed,
    },
    newValue: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
