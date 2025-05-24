import express from 'express';
import { generateSchedule } from '../controllers/huggingfaceController';

const router = express.Router();

router.post('/schedule', generateSchedule);

export default router;