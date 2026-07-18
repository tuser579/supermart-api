import { Router } from 'express';
import { orderController } from './order.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { requireRole } from '../../shared/middleware/role.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  assignDeliverySchema,
  orderQuerySchema,
} from './order.validation';
import { z } from 'zod';

const router = Router();

// All order routes require authentication
router.use(authMiddleware);

// POST /api/v1/orders — USER
router.post('/', requireRole('USER'), validate(createOrderSchema), orderController.createOrder);

// GET /api/v1/orders — USER (own) / ADMIN (all)
router.get(
  '/',
  requireRole('USER', 'ADMIN', 'STAFF'),
  validate(orderQuerySchema, 'query'),
  orderController.getOrders
);

// GET /api/v1/orders/:id
router.get('/:id', requireRole('USER', 'ADMIN', 'STAFF'), orderController.getOrderById);

// PUT /api/v1/orders/:id/status — ADMIN / STAFF
router.put(
  '/:id/status',
  requireRole('ADMIN', 'STAFF'),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

// POST /api/v1/orders/:id/assign — ADMIN
router.post(
  '/:id/assign',
  requireRole('ADMIN'),
  validate(assignDeliverySchema),
  orderController.assignDelivery
);

// POST /api/v1/orders/:id/cancel — USER
router.post(
  '/:id/cancel',
  requireRole('USER'),
  validate(z.object({ reason: z.string().max(500).optional() })),
  orderController.cancelOrder
);

export default router;
