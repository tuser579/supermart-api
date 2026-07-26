"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
const admin_service_1 = require("./admin.service");
exports.adminController = {
    getDashboard: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const stats = await admin_service_1.adminService.getDashboardStats();
        res.status(200).json(ApiResponse_1.ApiResponse.success('Dashboard statistics retrieved', stats));
    }),
    getSalesReport: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { period, days } = req.query;
        const report = await admin_service_1.adminService.getSalesReport(period, parseInt(days || '30'));
        res.status(200).json(ApiResponse_1.ApiResponse.success('Sales report retrieved', report));
    }),
    getTopProducts: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { limit } = req.query;
        const products = await admin_service_1.adminService.getTopProducts(parseInt(limit || '10'));
        res.status(200).json(ApiResponse_1.ApiResponse.success('Top products retrieved', products));
    }),
    getAllUsers: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { users, total, page, limit } = await admin_service_1.adminService.getAllUsers(req.query);
        res.status(200).json(ApiResponse_1.ApiResponse.paginated('Users retrieved', users, page, limit, total));
    }),
    toggleUserStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const user = await admin_service_1.adminService.toggleUserStatus(req.params.userId);
        res.status(200).json(ApiResponse_1.ApiResponse.success(`User ${user.isActive ? 'activated' : 'deactivated'}`, user));
    }),
    getStaffPerformance: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const performance = await admin_service_1.adminService.getStaffPerformance();
        res.status(200).json(ApiResponse_1.ApiResponse.success('Staff performance retrieved', performance));
    }),
};
//# sourceMappingURL=admin.controller.js.map