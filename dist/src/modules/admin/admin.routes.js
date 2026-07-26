"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const role_middleware_1 = require("../../shared/middleware/role.middleware");
const router = (0, express_1.Router)();
// All admin routes require ADMIN role
router.use(auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)('ADMIN'));
// GET /api/v1/admin/dashboard
router.get('/dashboard', admin_controller_1.adminController.getDashboard);
// GET /api/v1/admin/reports/sales
router.get('/reports/sales', admin_controller_1.adminController.getSalesReport);
// GET /api/v1/admin/reports/products
router.get('/reports/products', admin_controller_1.adminController.getTopProducts);
// GET /api/v1/admin/users
router.get('/users', admin_controller_1.adminController.getAllUsers);
// PATCH /api/v1/admin/users/:userId/status
router.patch('/users/:userId/status', admin_controller_1.adminController.toggleUserStatus);
// GET /api/v1/admin/staff/performance
router.get('/staff/performance', admin_controller_1.adminController.getStaffPerformance);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map