import { Request, Response } from 'express';
import Goal from '../models/Goal';

// Create a new goal
export const createGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, steps, userId } = req.body;

    if (!title || !description || !userId) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    const newGoal = new Goal({
      title,
      description,
      steps: steps || [],
      userId
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating goal', error });
  }
};

// Get all goals for a user
export const getGoalsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const goals = await Goal.find({ userId });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error });
  }
}; 