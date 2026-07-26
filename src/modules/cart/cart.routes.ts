import { Router } from 'express';
import { cartController } from './cart.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const addItemSchema = z.object({
  productId: z.preprocess(
    (val) => (val ? String(val).trim() : ''),
    z.string().min(1, 'Invalid product ID')
  ),
  quantity: z.preprocess(
    (val) => {
      const num = Number(val);
      return isNaN(num) || num < 1 ? 1 : Math.round(num);
    },
    z.number().int().positive()
  ),
});

const updateItemSchema = z.object({
  quantity: z.preprocess(
    (val) => {
      const num = Number(val);
      return isNaN(num) || num < 0 ? 0 : Math.round(num);
    },
    z.number().int().nonnegative()
  ),
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
