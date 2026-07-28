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
    getQuickOptions: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const options = await admin_service_1.adminService.getQuickOptions();
        res.status(200).json(ApiResponse_1.ApiResponse.success('Admin quick options retrieved successfully', options));
    }),
    getAssignedOrders: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { orders, total, page, limit } = await admin_service_1.adminService.getAssignedOrders(req.query);
        res.status(200).json(ApiResponse_1.ApiResponse.paginated('Assigned orders retrieved successfully', orders, page, limit, total));
    }),
    cancelOrder: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await admin_service_1.adminService.cancelOrderAsAdmin(req.params.id, req.user.userId, req.body.reason);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Order cancelled by admin successfully', order));
    }),
    getOutOfStockProducts: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { products, total, page, limit } = await admin_service_1.adminService.getOutOfStockProducts(req.query);
        res.status(200).json(ApiResponse_1.ApiResponse.paginated('Out of stock products retrieved successfully', products, page, limit, total));
    }),
    restockProduct: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { stock, addStock } = req.body;
        const product = await admin_service_1.adminService.restockProduct(req.params.id, stock, addStock);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Product restocked successfully', product));
    }),
    getAllProducts: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { products, total, page, limit } = await admin_service_1.adminService.getAllProductsForAdmin(req.query);
        res.status(200).json(ApiResponse_1.ApiResponse.paginated('Admin products retrieved successfully', products, page, limit, total));
    }),
    createProduct: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await admin_service_1.adminService.createProductAsAdmin(req.body, req.user.userId);
        res.status(201).json(ApiResponse_1.ApiResponse.created('Product created successfully by admin', product));
    }),
    updateProduct: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await admin_service_1.adminService.updateProductAsAdmin(req.params.id, req.body);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Product updated successfully by admin', product));
    }),
    updateProductImages: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const images = req.body.images || req.body.image || req.body.imageUrl;
        const product = await admin_service_1.adminService.updateProductImages(req.params.id, images);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Product images updated successfully by admin', product));
    }),
    deleteProduct: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await admin_service_1.adminService.deleteProductAsAdmin(req.params.id);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Product deleted successfully by admin', null));
    }),
};
//# sourceMappingURL=admin.controller.js.map