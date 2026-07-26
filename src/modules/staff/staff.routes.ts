import { Router } from 'express';
import { staffController } from './staff.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { requireRole } from '../../shared/middleware/role.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import {
  createStaffSchema,
  markAttendanceSchema,
  updateAvailabilitySchema,
} from './staff.validation';

const router = Router();

// All staff routes require authentication
router.use(authMiddleware);

// POST /api/v1/staff — ADMIN
router.post('/', requireRole('ADMIN'), validate(createStaffSchema), staffController.createStaff);

// GET /api/v1/staff — ADMIN
router.get('/', requireRole('ADMIN'), staffController.getAllStaff);

// GET /api/v1/staff/profile — STAFF
router.get('/profile', requireRole('STAFF'), staffController.getMyProfile);

// GET /api/v1/staff/orders — STAFF assigned orders
router.get('/orders', requireRole('STAFF'), staffController.getMyOrders);

// POST /api/v1/staff/attendance — STAFF
router.post(
  '/attendance',
  requireRole('STAFF'),
  validate(markAttendanceSchema),
  staffController.markAttendance
);

// GET /api/v1/staff/attendance — STAFF / ADMIN
router.get('/attendance', requireRole('STAFF', 'ADMIN'), staffController.getAttendance);

// GET /api/v1/staff/earnings — STAFF
router.get('/earnings', requireRole('STAFF'), staffController.getEarnings);

// PATCH /api/v1/staff/availability — STAFF
router.patch(
  '/availability',
  requireRole('STAFF'),
  validate(updateAvailabilitySchema),
  staffController.updateAvailability
);

// GET /api/v1/staff/quick-options — STAFF action checking & dashboard summary
router.get('/quick-options', requireRole('STAFF'), staffController.getQuickOptions);

export default router;
