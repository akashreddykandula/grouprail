import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import connectDB from './database/connection.js';
import corsOptions from './config/cors.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { notFound, globalErrorHandler } from './middleware/errorHandler.js';

// Route imports (added per phase)
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import tripRoutes from './routes/trips.js';
import memberRoutes from './routes/members.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';

// Socket handler
import { initSocket } from './services/socketService.js';

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
});

// Attach io to app for use in controllers
app.set('io', io);

// Initialize socket handlers
initSocket(io);

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));
app.use(cors(corsOptions));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/api', generalLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'GroupRail API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(globalErrorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`🚀 GroupRail API running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`📡 Socket.IO ready`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  });
};

start();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
