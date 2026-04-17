import mongoose, { Schema, Model } from 'mongoose';

export interface ILearningQuestion {
  _id: string;
  question: string;
  answer: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LearningQuestionSchema = new Schema<ILearningQuestion>(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
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

const LearningQuestion: Model<ILearningQuestion> = mongoose.models.LearningQuestion || mongoose.model<ILearningQuestion>('LearningQuestion', LearningQuestionSchema);

export default LearningQuestion;
