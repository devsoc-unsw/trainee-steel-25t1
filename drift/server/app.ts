import express, { Request, Response } from 'express';
import cors from 'cors';
import goalRoutes from './routes/goalRoutes';

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: 'Drift backend live' });
});

app.use('/api/goals', goalRoutes);

export default app; 