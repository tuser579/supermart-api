import { Router } from 'express';
import { notificationController } from './notification.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();

// All notification routes require auth
router.use(authMiddleware);

// GET /api/v1/notifications
router.get('/', notificationController.getNotifications);

// PUT /api/v1/notifications/read-all
router.put('/read-all', notificationController.markAllAsRead);

// PUT /api/v1/notifications/:id/read
router.put('/:id/read', notificationController.markAsRead);

// DELETE /api/v1/notifications/:id
router.delete('/:id', notificationController.deleteNotification);

export default router;
