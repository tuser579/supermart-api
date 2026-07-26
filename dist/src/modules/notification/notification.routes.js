"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("./notification.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const router = (0, express_1.Router)();
// All notification routes require auth
router.use(auth_middleware_1.authMiddleware);
// GET /api/v1/notifications
router.get('/', notification_controller_1.notificationController.getNotifications);
// PUT /api/v1/notifications/read-all
router.put('/read-all', notification_controller_1.notificationController.markAllAsRead);
// PUT /api/v1/notifications/:id/read
router.put('/:id/read', notification_controller_1.notificationController.markAsRead);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map