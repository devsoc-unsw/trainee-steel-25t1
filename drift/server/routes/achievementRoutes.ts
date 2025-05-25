import express from 'express';
import { 
  getUserAchievements, 
  createAchievement, 
  deleteAchievement, 
  getAchievementStats 
} from '../controllers/achievementController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/achievements/stats - Get achievement statistics (must be before /:achievementId)
router.get('/stats', getAchievementStats);

// GET /api/achievements - Get all user achievements
router.get('/', getUserAchievements);

// POST /api/achievements - Create new achievement
router.post('/', createAchievement);

// DELETE /api/achievements/:achievementId - Delete achievement
router.delete('/:achievementId', deleteAchievement);

export default router; 