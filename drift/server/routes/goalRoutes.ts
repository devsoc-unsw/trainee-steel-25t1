import express, { Router } from 'express';
import { createGoal, getGoalsByUser } from '../controllers/goalController';

const router: Router = express.Router();

// POST /api/goals - Create a new goal
router.post('/', createGoal);

// GET /api/goals/user/:userId - Get all goals for a user
router.get('/user/:userId', getGoalsByUser);

export default router; 