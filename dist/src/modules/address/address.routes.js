"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_controller_1 = require("./address.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const validation_middleware_1 = require("../../shared/middleware/validation.middleware");
const address_validation_1 = require("./address.validation");
const router = (0, express_1.Router)();
// All address routes require authentication
router.use(auth_middleware_1.authMiddleware);
// GET /api/v1/addresses — list all user's saved addresses
router.get('/', address_controller_1.addressController.list);
// POST /api/v1/addresses — save a new address
router.post('/', (0, validation_middleware_1.validate)(address_validation_1.createAddressSchema), address_controller_1.addressController.create);
// PUT /api/v1/addresses/:id — update an address
router.put('/:id', (0, validation_middleware_1.validate)(address_validation_1.updateAddressSchema), address_controller_1.addressController.update);
// DELETE /api/v1/addresses/:id — delete an address
router.delete('/:id', address_controller_1.addressController.delete);
// PATCH /api/v1/addresses/:id/default — set as default
router.patch('/:id/default', address_controller_1.addressController.setDefault);
exports.default = router;
//# sourceMappingURL=address.routes.js.map