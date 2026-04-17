import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * AI Configuration Interface
 */
export interface IAIConfig extends Document {
  name: string;
  promptTemplate: string;
  maxTokens: number;
  temperature: number;
  costLimit: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AI Configuration Schema
 */
const AIConfigSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    promptTemplate: {
      type: String,
      required: true,
      trim: true,
    },
    maxTokens: {
      type: Number,
      required: true,
      default: 1000,
      min: 1,
    },
    temperature: {
      type: Number,
      required: true,
      default: 0.7,
      min: 0,
      max: 2,
    },
    costLimit: {
      type: Number,
      required: true,
      default: 100,
      min: 0,
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

// Indexes for faster queries
AIConfigSchema.index({ name: 1 });
AIConfigSchema.index({ isActive: 1 });

const AIConfigModel: Model<IAIConfig> = mongoose.models.AIConfig || mongoose.model<IAIConfig>('AIConfig', AIConfigSchema);

export default AIConfigModel;
