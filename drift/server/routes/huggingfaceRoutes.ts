import express from 'express';
import { generateSchedule, updateScheduleProgress } from '../controllers/huggingfaceController';

const router = express.Router();

router.post('/schedule', generateSchedule);
router.post('/update-progress', updateScheduleProgress);

export default router;