import { Router } from 'express';
import { productController } from './product.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { requireRole } from '../../shared/middleware/role.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from './product.validation';

const router = Router();

// GET /api/v1/products — Public
router.get('/', validate(productQuerySchema, 'query'), productController.getAllProducts);

// GET /api/v1/products/categories — Public
router.get('/categories', productController.getCategories);

// GET /api/v1/products/:id — Public
router.get('/:id', productController.getProductById);

// POST /api/v1/products — ADMIN only
router.post(
  '/',
  authMiddleware,
  requireRole('ADMIN'),
  validate(createProductSchema),
  productController.createProduct
);

// PUT /api/v1/products/:id — ADMIN only
router.put(
  '/:id',
  authMiddleware,
  requireRole('ADMIN'),
  validate(updateProductSchema),
  productController.updateProduct
);

// DELETE /api/v1/products/:id — ADMIN only
router.delete(
  '/:id',
  authMiddleware,
  requireRole('ADMIN'),
  productController.deleteProduct
);

export default router;
