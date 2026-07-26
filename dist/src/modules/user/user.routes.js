"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const validation_middleware_1 = require("../../shared/middleware/validation.middleware");
const user_validation_1 = require("./user.validation");
const zod_1 = require("zod");
const pushTokenSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Push token is required'),
});
const router = (0, express_1.Router)();
// All user routes require authentication
router.use(auth_middleware_1.authMiddleware);
// GET /api/v1/users/profile
router.get('/profile', user_controller_1.userController.getProfile);
// PUT /api/v1/users/profile
router.put('/profile', (0, validation_middleware_1.validate)(user_validation_1.updateProfileSchema), user_controller_1.userController.updateProfile);
// PUT /api/v1/users/change-password
router.put('/change-password', (0, validation_middleware_1.validate)(user_validation_1.changePasswordSchema), user_controller_1.userController.changePassword);
// DELETE /api/v1/users/account
router.delete('/account', user_controller_1.userController.deleteAccount);
// POST /api/v1/users/push-token — save Expo push token
router.post('/push-token', (0, validation_middleware_1.validate)(pushTokenSchema), user_controller_1.userController.savePushToken);
exports.default = router;
//# sourceMappingURL=user.routes.js.map