import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../shared/middleware/validation.middleware';
import { authRateLimiter } from '../../shared/middleware/rateLimiter.middleware';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  refreshTokenSchema,
} from './auth.validation';
import { z } from 'zod';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', authRateLimiter, validate(registerSchema), authController.register);

// POST /api/v1/auth/login
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);

// POST /api/v1/auth/verify-otp
router.post('/verify-otp', validate(verifyOTPSchema), authController.verifyOTP);

// POST /api/v1/auth/resend-otp
router.post(
  '/resend-otp',
  validate(z.object({ email: z.string().email() })),
  authController.resendOTP
);

// POST /api/v1/auth/refresh-token
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

// POST /api/v1/auth/logout (requires auth)
router.post('/logout', authMiddleware, authController.logout);

export default router;
