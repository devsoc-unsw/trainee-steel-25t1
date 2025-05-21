import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import goalRoutes from './routes/goalRoutes';
import authRoutes from './routes/authRoutes';
import openaiRoutes from './routes/openaiRoutes';

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: 'Drift backend live' });
});

app.use('/api/goals', goalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/openai', openaiRoutes);

export default app; 