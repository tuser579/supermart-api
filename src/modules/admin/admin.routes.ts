import { Router } from 'express';
import { adminController } from './admin.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { requireRole } from '../../shared/middleware/role.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import {
  createProductSchema,
  updateProductSchema,
  restockProductSchema,
  productQuerySchema,
} from '../product/product.validation';

const router = Router();

// All admin routes require ADMIN role
router.use(authMiddleware, requireRole('ADMIN'));

// GET /api/v1/admin/dashboard
router.get('/dashboard', adminController.getDashboard);

// GET /api/v1/admin/reports/sales
router.get('/reports/sales', adminController.getSalesReport);

// GET /api/v1/admin/reports/products
router.get('/reports/products', adminController.getTopProducts);

// GET /api/v1/admin/users
router.get('/users', adminController.getAllUsers);

// PATCH /api/v1/admin/users/:userId/status
router.patch('/users/:userId/status', adminController.toggleUserStatus);

// GET /api/v1/admin/staff/performance
router.get('/staff/performance', adminController.getStaffPerformance);

// GET /api/v1/admin/quick-options
router.get('/quick-options', adminController.getQuickOptions);

// GET /api/v1/admin/orders/assigned
router.get('/orders/assigned', adminController.getAssignedOrders);

// POST /api/v1/admin/orders/:id/cancel
router.post('/orders/:id/cancel', adminController.cancelOrder);

// GET /api/v1/admin/products/out-of-stock
router.get('/products/out-of-stock', adminController.getOutOfStockProducts);

// PATCH /api/v1/admin/products/:id/restock
router.patch('/products/:id/restock', validate(restockProductSchema), adminController.restockProduct);

// GET /api/v1/admin/products — List all products (active & inactive)
router.get('/products', validate(productQuerySchema, 'query'), adminController.getAllProducts);

// POST /api/v1/admin/products — Add new product
router.post('/products', validate(createProductSchema), adminController.createProduct);

// PUT /api/v1/admin/products/:id — Edit product
router.put('/products/:id', validate(updateProductSchema), adminController.updateProduct);

// DELETE /api/v1/admin/products/:id — Delete/Deactivate product
router.delete('/products/:id', adminController.deleteProduct);

export default router;
