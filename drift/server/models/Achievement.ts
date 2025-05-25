import mongoose, { Document } from 'mongoose';

export interface IAchievement extends Document {
  name: string;
  objective: string;
  deadline: string;
  dedication: 'casual' | 'moderate' | 'intense';
  completedDate: Date;
  totalTasks: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  objective: {
    type: String,
    required: true,
    trim: true
  },
  deadline: {
    type: String,
    required: true
  },
  dedication: {
    type: String,
    enum: ['casual', 'moderate', 'intense'],
    required: true
  },
  completedDate: {
    type: Date,
    required: true
  },
  totalTasks: {
    type: Number,
    required: true,
    min: 1
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

// Index for efficient queries
achievementSchema.index({ userId: 1, completedDate: -1 });

export default mongoose.model<IAchievement>('Achievement', achievementSchema); 