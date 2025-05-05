import express, { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

// POST /api/auth/register - Register a user
router.post('/register', registerUser);

// POST /api/auth/login - Login user
router.post('/login', loginUser);

// GET /api/auth/profile - Get user profile (protected)
router.get('/profile', protect, getUserProfile);

export default router; 