"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staff_controller_1 = require("./staff.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const role_middleware_1 = require("../../shared/middleware/role.middleware");
const validation_middleware_1 = require("../../shared/middleware/validation.middleware");
const staff_validation_1 = require("./staff.validation");
const router = (0, express_1.Router)();
// All staff routes require authentication
router.use(auth_middleware_1.authMiddleware);
// POST /api/v1/staff — ADMIN
router.post('/', (0, role_middleware_1.requireRole)('ADMIN'), (0, validation_middleware_1.validate)(staff_validation_1.createStaffSchema), staff_controller_1.staffController.createStaff);
// GET /api/v1/staff — ADMIN
router.get('/', (0, role_middleware_1.requireRole)('ADMIN'), staff_controller_1.staffController.getAllStaff);
// GET /api/v1/staff/profile — STAFF
router.get('/profile', (0, role_middleware_1.requireRole)('STAFF'), staff_controller_1.staffController.getMyProfile);
// GET /api/v1/staff/orders — STAFF assigned orders
router.get('/orders', (0, role_middleware_1.requireRole)('STAFF'), staff_controller_1.staffController.getMyOrders);
// POST /api/v1/staff/attendance — STAFF
router.post('/attendance', (0, role_middleware_1.requireRole)('STAFF'), (0, validation_middleware_1.validate)(staff_validation_1.markAttendanceSchema), staff_controller_1.staffController.markAttendance);
// GET /api/v1/staff/attendance — STAFF / ADMIN
router.get('/attendance', (0, role_middleware_1.requireRole)('STAFF', 'ADMIN'), staff_controller_1.staffController.getAttendance);
// GET /api/v1/staff/earnings — STAFF
router.get('/earnings', (0, role_middleware_1.requireRole)('STAFF'), staff_controller_1.staffController.getEarnings);
// PATCH /api/v1/staff/availability — STAFF
router.patch('/availability', (0, role_middleware_1.requireRole)('STAFF'), (0, validation_middleware_1.validate)(staff_validation_1.updateAvailabilitySchema), staff_controller_1.staffController.updateAvailability);
exports.default = router;
//# sourceMappingURL=staff.routes.js.map