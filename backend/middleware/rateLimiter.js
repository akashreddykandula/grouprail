import rateLimit from 'express-rate-limit';
import { CONFIG } from '../config/constants.js';

export const generalLimiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT_WINDOW_MS,
  max: CONFIG.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
});

export const authLimiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT_WINDOW_MS,
  max: CONFIG.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
  skipSuccessfulRequests: true,
});
