"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validation_middleware_1 = require("../../shared/middleware/validation.middleware");
const rateLimiter_middleware_1 = require("../../shared/middleware/rateLimiter.middleware");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const auth_validation_1 = require("./auth.validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// POST /api/v1/auth/register
router.post('/register', rateLimiter_middleware_1.authRateLimiter, (0, validation_middleware_1.validate)(auth_validation_1.registerSchema), auth_controller_1.authController.register);
// POST /api/v1/auth/login
router.post('/login', rateLimiter_middleware_1.authRateLimiter, (0, validation_middleware_1.validate)(auth_validation_1.loginSchema), auth_controller_1.authController.login);
// POST /api/v1/auth/verify-otp
router.post('/verify-otp', (0, validation_middleware_1.validate)(auth_validation_1.verifyOTPSchema), auth_controller_1.authController.verifyOTP);
// POST /api/v1/auth/resend-otp
router.post('/resend-otp', (0, validation_middleware_1.validate)(zod_1.z.object({ email: zod_1.z.string().email() })), auth_controller_1.authController.resendOTP);
// POST /api/v1/auth/refresh-token
router.post('/refresh-token', (0, validation_middleware_1.validate)(auth_validation_1.refreshTokenSchema), auth_controller_1.authController.refreshToken);
// POST /api/v1/auth/logout (requires auth)
router.post('/logout', auth_middleware_1.authMiddleware, auth_controller_1.authController.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map