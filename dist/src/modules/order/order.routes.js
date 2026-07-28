"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const role_middleware_1 = require("../../shared/middleware/role.middleware");
const validation_middleware_1 = require("../../shared/middleware/validation.middleware");
const order_validation_1 = require("./order.validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// All order routes require authentication
router.use(auth_middleware_1.authMiddleware);
// POST /api/v1/orders — USER
router.post('/', (0, role_middleware_1.requireRole)('USER'), (0, validation_middleware_1.validate)(order_validation_1.createOrderSchema), order_controller_1.orderController.createOrder);
// GET /api/v1/orders — USER (own) / ADMIN (all)
router.get('/', (0, role_middleware_1.requireRole)('USER', 'ADMIN', 'STAFF'), (0, validation_middleware_1.validate)(order_validation_1.orderQuerySchema, 'query'), order_controller_1.orderController.getOrders);
// POST /api/v1/orders/:id/pay — USER
router.post('/:id/pay', (0, role_middleware_1.requireRole)('USER'), (0, validation_middleware_1.validate)(order_validation_1.payOrderSchema), order_controller_1.orderController.payOrder);
// POST /api/v1/orders/:id/return — USER
router.post('/:id/return', (0, role_middleware_1.requireRole)('USER'), (0, validation_middleware_1.validate)(order_validation_1.returnOrderSchema), order_controller_1.orderController.returnOrder);
// POST /api/v1/orders/:id/cancel — USER / ADMIN
router.post('/:id/cancel', (0, role_middleware_1.requireRole)('USER', 'ADMIN'), (0, validation_middleware_1.validate)(zod_1.z.object({ reason: zod_1.z.string().max(500).optional() })), order_controller_1.orderController.cancelOrder);
// POST /api/v1/orders/:id/assign — ADMIN
router.post('/:id/assign', (0, role_middleware_1.requireRole)('ADMIN'), (0, validation_middleware_1.validate)(order_validation_1.assignDeliverySchema), order_controller_1.orderController.assignDelivery);
// PUT /api/v1/orders/:id/status — ADMIN / STAFF
router.put('/:id/status', (0, role_middleware_1.requireRole)('ADMIN', 'STAFF'), (0, validation_middleware_1.validate)(order_validation_1.updateOrderStatusSchema), order_controller_1.orderController.updateOrderStatus);
// GET /api/v1/orders/:id — GET single order
router.get('/:id', (0, role_middleware_1.requireRole)('USER', 'ADMIN', 'STAFF'), order_controller_1.orderController.getOrderById);
exports.default = router;
//# sourceMappingURL=order.routes.js.map