import dotenv from 'dotenv';
import path from 'path';
import app from './app';
import connectDB from './config/db';

// Load environment variables with explicit path
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
}); 