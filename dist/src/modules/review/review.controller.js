"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
const review_service_1 = require("./review.service");
exports.reviewController = {
    createReview: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const review = await review_service_1.reviewService.createReview(req.user.userId, req.body);
        res.status(201).json(ApiResponse_1.ApiResponse.created('Review submitted successfully', review));
    }),
    getProductReviews: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await review_service_1.reviewService.getProductReviews(req.params.productId, req.query);
        res.status(200).json(ApiResponse_1.ApiResponse.paginated('Reviews retrieved', result.reviews, result.page, result.limit, result.total));
    }),
    deleteReview: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await review_service_1.reviewService.deleteReview(req.params.id, req.user.userId, req.user.role);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Review deleted successfully', null));
    }),
};
//# sourceMappingURL=review.controller.js.map