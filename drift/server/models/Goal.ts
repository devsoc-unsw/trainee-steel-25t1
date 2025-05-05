import mongoose, { Document } from 'mongoose';

export interface IGoal extends Document {
  title: string;
  description: string;
  steps: string[];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  steps: {
    type: [String],
    default: []
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IGoal>('Goal', goalSchema); 