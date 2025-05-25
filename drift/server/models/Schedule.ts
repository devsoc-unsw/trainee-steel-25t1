import mongoose, { Document } from 'mongoose';

export interface ISchedule extends Document {
  userId?: mongoose.Types.ObjectId;
  goal: string;
  startDate: string;
  endDate: string;
  intensity: string;
  rawSchedule: string;
  overallProgress: number;
  createdAt: Date;
}

const scheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  goal: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  intensity: { type: String, required: true },
  rawSchedule: { type: String, required: true },
  overallProgress: { type: Number, default: 0 }, // <-- Add this line
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISchedule>('Schedule', scheduleSchema);