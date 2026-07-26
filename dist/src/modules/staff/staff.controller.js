"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
const staff_service_1 = require("./staff.service");
exports.staffController = {
    createStaff: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const staff = await staff_service_1.staffService.createStaff(req.body);
        res.status(201).json(ApiResponse_1.ApiResponse.created('Staff member created successfully', staff));
    }),
    getAllStaff: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { staff, total, page, limit } = await staff_service_1.staffService.getAllStaff(req.query);
        res.status(200).json(ApiResponse_1.ApiResponse.paginated('Staff retrieved', staff, page, limit, total));
    }),
    getMyProfile: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const profile = await staff_service_1.staffService.getStaffProfile(req.user.userId);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Staff profile retrieved', profile));
    }),
    getMyOrders: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { orders, total, page, limit } = await staff_service_1.staffService.getStaffOrders(req.user.userId, req.query);
        res.status(200).json(ApiResponse_1.ApiResponse.paginated('Staff orders retrieved', orders, page, limit, total));
    }),
    markAttendance: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const attendance = await staff_service_1.staffService.markAttendance(req.user.userId, req.body);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Attendance marked', attendance));
    }),
    getAttendance: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const attendance = await staff_service_1.staffService.getAttendance(req.user.userId, req.user.role, req.query.staffId);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Attendance records retrieved', attendance));
    }),
    getEarnings: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const earnings = await staff_service_1.staffService.getEarnings(req.user.userId);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Earnings retrieved', earnings));
    }),
    updateAvailability: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const staff = await staff_service_1.staffService.updateAvailability(req.user.userId, req.body.isAvailable);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Availability updated', staff));
    }),
};
//# sourceMappingURL=staff.controller.js.map