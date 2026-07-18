import { Router } from 'express';
import { userController } from './user.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import { updateProfileSchema, changePasswordSchema } from './user.validation';

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

export default router;
