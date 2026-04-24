import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './backend/routes/userRoutes.js';
import sudokuRoutes from './backend/routes/sudokuRoutes.js';
import highscoreRoutes from './backend/routes/highscoreRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/sudoku', sudokuRoutes);
app.use('/api/highscore', highscoreRoutes);

// Health check — useful for Render to confirm the server is up
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    // Drop the rogue index if it exists, then sync correct ones
    try {
      await mongoose.connection.collection('games').dropIndex('gameId_1');
      console.log('Dropped stale gameId_1 index');
    } catch (e) {
      // Index doesn't exist — that's fine
    }
    
    // Rebuild only the correct indexes defined in your schemas
    await Promise.all([
      mongoose.connection.collection('games').createIndex({ name: 1 }, { unique: true }),
      mongoose.connection.collection('highscores').createIndex({ userId: 1, gameId: 1 }, { unique: true }),
    ]);
    console.log('Indexes synced correctly');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

  // Serve built React app in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test API: http://localhost:${PORT}/api/test`);
});