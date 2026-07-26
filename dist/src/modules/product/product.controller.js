"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
const product_service_1 = require("./product.service");
exports.productController = {
    createProduct: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await product_service_1.productService.createProduct(req.body, req.user.userId);
        res.status(201).json(ApiResponse_1.ApiResponse.created('Product created successfully', product));
    }),
    getAllProducts: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { products, total, page, limit } = await product_service_1.productService.getAllProducts(req.query);
        res.status(200).json(ApiResponse_1.ApiResponse.paginated('Products retrieved', products, page, limit, total));
    }),
    getProductById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await product_service_1.productService.getProductById(req.params.id);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Product retrieved', product));
    }),
    updateProduct: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await product_service_1.productService.updateProduct(req.params.id, req.body);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Product updated successfully', product));
    }),
    deleteProduct: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await product_service_1.productService.deleteProduct(req.params.id);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Product deleted successfully', null));
    }),
    getCategories: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const categories = await product_service_1.productService.getCategories();
        res.status(200).json(ApiResponse_1.ApiResponse.success('Categories retrieved', categories));
    }),
};
//# sourceMappingURL=product.controller.js.map