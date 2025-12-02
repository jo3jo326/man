
// Load environment variables before any imports
require('dotenv').config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Import conversation, AI, and auth routes
import convoRoutes from './routes/convo.routes';
import aiRoutes from './routes/ai.routes';
import authRoutes from './routes/auth.routes';

// Middleware

app.use(cookieParser());



// Auth endpoints
app.use('/api/auth', authRoutes);

// Conversation history endpoints
app.use('/api/conversations', convoRoutes);

// AI response endpoint
app.use('/api/ai', aiRoutes);

// Test endpoint
app.get('/api/ping', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Contexta backend is running!',
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Contexta backend running on http://localhost:${PORT}`);
  console.log(`📡 API ready at http://localhost:${PORT}/api`);
});
