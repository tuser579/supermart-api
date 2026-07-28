"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
const order_service_1 = require("./order.service");
exports.orderController = {
    createOrder: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await order_service_1.orderService.createOrder(req.user.userId, req.body);
        res.status(201).json(ApiResponse_1.ApiResponse.created('Order placed successfully', order));
    }),
    getOrders: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { orders, total, page, limit } = await order_service_1.orderService.getOrders(req.user.userId, req.user.role, req.query);
        res.status(200).json(ApiResponse_1.ApiResponse.paginated('Orders retrieved', orders, page, limit, total));
    }),
    getOrderById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await order_service_1.orderService.getOrderById(req.params.id, req.user.userId, req.user.role);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Order retrieved', order));
    }),
    updateOrderStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await order_service_1.orderService.updateOrderStatus(req.params.id, req.body, req.user.userId, req.user.role);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Order status updated', order));
    }),
    assignDelivery: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await order_service_1.orderService.assignDelivery(req.params.id, req.body.staffId);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Delivery assigned successfully', order));
    }),
    cancelOrder: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await order_service_1.orderService.cancelOrder(req.params.id, req.user.userId, req.user.role, req.body.reason);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Order cancelled successfully', order));
    }),
    returnOrder: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await order_service_1.orderService.returnOrder(req.params.id, req.user.userId, req.body);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Return request submitted successfully', order));
    }),
    payOrder: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await order_service_1.orderService.payOrder(req.params.id, req.user.userId, req.body);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Payment recorded successfully', order));
    }),
};
//# sourceMappingURL=order.controller.js.map