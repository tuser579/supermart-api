import { Router } from 'express';
import { cartController } from './cart.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const addItemSchema = z.object({
  productId: z.string().min(1, 'Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

const updateItemSchema = z.object({
  quantity: z.number().int().nonnegative('Quantity must be 0 or more'),
});

// All cart routes require auth
router.use(authMiddleware);

// GET /api/v1/cart
router.get('/', cartController.getCart);

// POST /api/v1/cart/items
router.post('/items', validate(addItemSchema), cartController.addItem);

// PUT /api/v1/cart/items/:itemId
router.put('/items/:itemId', validate(updateItemSchema), cartController.updateItem);

// DELETE /api/v1/cart/items/:itemId
router.delete('/items/:itemId', cartController.removeItem);

// DELETE /api/v1/cart
router.delete('/', cartController.clearCart);

export default router;
