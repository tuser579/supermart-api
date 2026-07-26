"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
const user_service_1 = require("./user.service");
exports.userController = {
    getProfile: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.userId;
        const user = await user_service_1.userService.getProfile(userId);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Profile retrieved', user));
    }),
    updateProfile: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.userId;
        const user = await user_service_1.userService.updateProfile(userId, req.body);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Profile updated successfully', user));
    }),
    changePassword: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.userId;
        await user_service_1.userService.changePassword(userId, req.body);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Password changed successfully', null));
    }),
    deleteAccount: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.userId;
        await user_service_1.userService.deleteAccount(userId);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Account deactivated successfully', null));
    }),
    savePushToken: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.userId;
        await user_service_1.userService.savePushToken(userId, req.body.token);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Push token saved successfully', null));
    }),
};
//# sourceMappingURL=user.controller.js.map