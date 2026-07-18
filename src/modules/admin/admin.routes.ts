import { Router } from 'express';
import { adminController } from './admin.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { requireRole } from '../../shared/middleware/role.middleware';

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

export default router;
