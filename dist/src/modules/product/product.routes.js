"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const role_middleware_1 = require("../../shared/middleware/role.middleware");
const validation_middleware_1 = require("../../shared/middleware/validation.middleware");
const product_validation_1 = require("./product.validation");
const router = (0, express_1.Router)();
// GET /api/v1/products — Public
router.get('/', (0, validation_middleware_1.validate)(product_validation_1.productQuerySchema, 'query'), product_controller_1.productController.getAllProducts);
// GET /api/v1/products/categories — Public
router.get('/categories', product_controller_1.productController.getCategories);
// GET /api/v1/products/:id — Public
router.get('/:id', product_controller_1.productController.getProductById);
// POST /api/v1/products — ADMIN only
router.post('/', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)('ADMIN'), (0, validation_middleware_1.validate)(product_validation_1.createProductSchema), product_controller_1.productController.createProduct);
// PUT /api/v1/products/:id — ADMIN only
router.put('/:id', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)('ADMIN'), (0, validation_middleware_1.validate)(product_validation_1.updateProductSchema), product_controller_1.productController.updateProduct);
// DELETE /api/v1/products/:id — ADMIN only
router.delete('/:id', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)('ADMIN'), product_controller_1.productController.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map