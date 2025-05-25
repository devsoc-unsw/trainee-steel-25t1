import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Achievement from '../models/Achievement';

// Get all achievements for a user
export const getUserAchievements = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const achievements = await Achievement.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ completedDate: -1 }) // Most recent first
      .lean();

    res.json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch achievements' 
    });
  }
};

// Create a new achievement
export const createAchievement = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { name, objective, deadline, dedication, completedDate, totalTasks } = req.body;

    // Validation
    if (!name || !objective || !deadline || !dedication || !completedDate || !totalTasks) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (!['casual', 'moderate', 'intense'].includes(dedication)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid dedication level' 
      });
    }

    if (totalTasks < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Total tasks must be at least 1' 
      });
    }

    // Handle uploaded images
    const images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: any) => {
        images.push(file.filename);
      });
    }

    const achievement = new Achievement({
      name: name.trim(),
      objective: objective.trim(),
      deadline,
      dedication,
      completedDate: new Date(completedDate),
      totalTasks: parseInt(totalTasks),
      images,
      userId: new mongoose.Types.ObjectId(userId)
    });

    await achievement.save();

    res.status(201).json({
      success: true,
      message: 'Achievement saved successfully',
      achievement
    });
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save achievement' 
    });
  }
};

// Delete an achievement
export const deleteAchievement = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { achievementId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const achievement = await Achievement.findOneAndDelete({
      _id: achievementId,
      userId: new mongoose.Types.ObjectId(userId) // Ensure user can only delete their own achievements
    });

    if (!achievement) {
      return res.status(404).json({ 
        success: false, 
        message: 'Achievement not found' 
      });
    }

    res.json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete achievement' 
    });
  }
};

// Get achievement statistics
export const getAchievementStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const stats = await Achievement.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalAchievements: { $sum: 1 },
          totalTasks: { $sum: '$totalTasks' },
          dedicationBreakdown: {
            $push: '$dedication'
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalAchievements: 1,
          totalTasks: 1,
          casualCount: {
            $size: {
              $filter: {
                input: '$dedicationBreakdown',
                cond: { $eq: ['$$this', 'casual'] }
              }
            }
          },
          moderateCount: {
            $size: {
              $filter: {
                input: '$dedicationBreakdown',
                cond: { $eq: ['$$this', 'moderate'] }
              }
            }
          },
          intenseCount: {
            $size: {
              $filter: {
                input: '$dedicationBreakdown',
                cond: { $eq: ['$$this', 'intense'] }
              }
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalAchievements: 0,
      totalTasks: 0,
      casualCount: 0,
      moderateCount: 0,
      intenseCount: 0
    };

    res.json({
      success: true,
      stats: result
    });
  } catch (error) {
    console.error('Error fetching achievement stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch achievement statistics' 
    });
  }
}; 