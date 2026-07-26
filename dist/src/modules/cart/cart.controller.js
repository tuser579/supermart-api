"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
const cart_service_1 = require("./cart.service");
exports.cartController = {
    getCart: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const cart = await cart_service_1.cartService.getCart(req.user.userId);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Cart retrieved', cart));
    }),
    addItem: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const cart = await cart_service_1.cartService.addItem(req.user.userId, req.body);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Item added to cart', cart));
    }),
    updateItem: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const cart = await cart_service_1.cartService.updateItem(req.user.userId, req.params.itemId, req.body);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Cart item updated', cart));
    }),
    removeItem: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const cart = await cart_service_1.cartService.removeItem(req.user.userId, req.params.itemId);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Item removed from cart', cart));
    }),
    clearCart: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await cart_service_1.cartService.clearCart(req.user.userId);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Cart cleared', null));
    }),
};
//# sourceMappingURL=cart.controller.js.map