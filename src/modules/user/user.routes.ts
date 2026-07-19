import { Router } from 'express';
import { userController } from './user.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import { updateProfileSchema, changePasswordSchema } from './user.validation';
import { z } from 'zod';

const pushTokenSchema = z.object({
  token: z.string().min(1, 'Push token is required'),
});

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// GET /api/v1/users/profile
router.get('/profile', userController.getProfile);

// PUT /api/v1/users/profile
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);

// PUT /api/v1/users/change-password
router.put('/change-password', validate(changePasswordSchema), userController.changePassword);

// DELETE /api/v1/users/account
router.delete('/account', userController.deleteAccount);

// POST /api/v1/users/push-token — save Expo push token
router.post('/push-token', validate(pushTokenSchema), userController.savePushToken);

export default router;
