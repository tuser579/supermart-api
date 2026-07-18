import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 min
const max = parseInt(process.env.RATE_LIMIT_MAX || '100');

export const globalRateLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new ApiError(429, 'Too many requests. Please try again later.'));
  },
});

// Stricter limiter for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
  handler: (_req, _res, next) => {
    next(new ApiError(429, 'Too many authentication attempts. Try again in 15 minutes.'));
  },
});
