import express from 'express';
import { generateSchedule, generateMockSchedule } from '../controllers/openaiController';

const router = express.Router();

// Generate a schedule using OpenAI
router.post('/generate-schedule', generateSchedule);

// Generate a mock schedule (for testing without API key)
router.post('/generate-mock-schedule', generateMockSchedule);

export default router; 