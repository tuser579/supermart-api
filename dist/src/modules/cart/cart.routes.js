"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("./cart.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const validation_middleware_1 = require("../../shared/middleware/validation.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const addItemSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, 'Invalid product ID'),
    quantity: zod_1.z.number().int().positive('Quantity must be a positive integer'),
});
const updateItemSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().nonnegative('Quantity must be 0 or more'),
});
// All cart routes require auth
router.use(auth_middleware_1.authMiddleware);
// GET /api/v1/cart
router.get('/', cart_controller_1.cartController.getCart);
// POST /api/v1/cart/items
router.post('/items', (0, validation_middleware_1.validate)(addItemSchema), cart_controller_1.cartController.addItem);
// PUT /api/v1/cart/items/:itemId
router.put('/items/:itemId', (0, validation_middleware_1.validate)(updateItemSchema), cart_controller_1.cartController.updateItem);
// DELETE /api/v1/cart/items/:itemId
router.delete('/items/:itemId', cart_controller_1.cartController.removeItem);
// DELETE /api/v1/cart
router.delete('/', cart_controller_1.cartController.clearCart);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map