"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const role_middleware_1 = require("../../shared/middleware/role.middleware");
const validation_middleware_1 = require("../../shared/middleware/validation.middleware");
const product_validation_1 = require("../product/product.validation");
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
// GET /api/v1/admin/quick-options
router.get('/quick-options', admin_controller_1.adminController.getQuickOptions);
// GET /api/v1/admin/orders/assigned
router.get('/orders/assigned', admin_controller_1.adminController.getAssignedOrders);
// POST /api/v1/admin/orders/:id/cancel
router.post('/orders/:id/cancel', admin_controller_1.adminController.cancelOrder);
// GET /api/v1/admin/products/out-of-stock
router.get('/products/out-of-stock', admin_controller_1.adminController.getOutOfStockProducts);
// PATCH /api/v1/admin/products/:id/restock
router.patch('/products/:id/restock', (0, validation_middleware_1.validate)(product_validation_1.restockProductSchema), admin_controller_1.adminController.restockProduct);
// GET /api/v1/admin/products — List all products (active & inactive)
router.get('/products', (0, validation_middleware_1.validate)(product_validation_1.productQuerySchema, 'query'), admin_controller_1.adminController.getAllProducts);
// POST /api/v1/admin/products — Add new product
router.post('/products', (0, validation_middleware_1.validate)(product_validation_1.createProductSchema), admin_controller_1.adminController.createProduct);
// PUT /api/v1/admin/products/:id — Edit product
router.put('/products/:id', (0, validation_middleware_1.validate)(product_validation_1.updateProductSchema), admin_controller_1.adminController.updateProduct);
// PATCH /api/v1/admin/products/:id/images — Update product images
router.patch('/products/:id/images', admin_controller_1.adminController.updateProductImages);
// DELETE /api/v1/admin/products/:id — Delete/Deactivate product
router.delete('/products/:id', admin_controller_1.adminController.deleteProduct);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map