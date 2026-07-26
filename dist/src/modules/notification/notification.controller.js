"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
const notification_service_1 = require("./notification.service");
exports.notificationController = {
    getNotifications: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await notification_service_1.notificationService.getUserNotifications(req.user.userId, req.query);
        res.status(200).json(ApiResponse_1.ApiResponse.paginated('Notifications retrieved', result.notifications, result.page, result.limit, result.total));
    }),
    markAsRead: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const notification = await notification_service_1.notificationService.markAsRead(req.params.id, req.user.userId);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Notification marked as read', notification));
    }),
    markAllAsRead: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await notification_service_1.notificationService.markAllAsRead(req.user.userId);
        res.status(200).json(ApiResponse_1.ApiResponse.success('All notifications marked as read', null));
    }),
};
//# sourceMappingURL=notification.controller.js.map