"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
const auth_service_1 = require("./auth.service");
exports.authController = {
    register: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await auth_service_1.authService.register(req.body);
        res.status(201).json(ApiResponse_1.ApiResponse.created('Registration successful. Please verify your email with the OTP sent.', result));
    }),
    login: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await auth_service_1.authService.login(req.body);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Login successful', result));
    }),
    verifyOTP: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await auth_service_1.authService.verifyOTP(req.body);
        res.status(200).json(ApiResponse_1.ApiResponse.success(result.message, null));
    }),
    resendOTP: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email } = req.body;
        const result = await auth_service_1.authService.resendOTP(email);
        res.status(200).json(ApiResponse_1.ApiResponse.success(result.message, null));
    }),
    refreshToken: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { refreshToken } = req.body;
        const result = await auth_service_1.authService.refreshToken(refreshToken);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Token refreshed successfully', result));
    }),
    logout: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        // Stateless JWT — client deletes the token
        // In production, add token to a Redis blacklist here
        res.status(200).json(ApiResponse_1.ApiResponse.success('Logged out successfully', null));
    }),
};
//# sourceMappingURL=auth.controller.js.map