"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = void 0;
const database_config_1 = require("../../shared/config/database.config");
const ApiError_1 = require("../../shared/utils/ApiError");
const recalculateProductRating = async (productId) => {
    const result = await database_config_1.prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { rating: true },
    });
    await database_config_1.prisma.product.update({
        where: { id: productId },
        data: {
            rating: Math.round((result._avg.rating || 0) * 10) / 10,
            ratingCount: result._count.rating,
        },
    });
};
exports.reviewService = {
    createReview: async (userId, dto) => {
        // Check product exists
        const product = await database_config_1.prisma.product.findUnique({ where: { id: dto.productId, isActive: true } });
        if (!product)
            throw ApiError_1.ApiError.notFound('Product not found');
        // Check if user has purchased the product
        const hasPurchased = await database_config_1.prisma.orderItem.findFirst({
            where: {
                productId: dto.productId,
                order: {
                    userId,
                    status: 'DELIVERED',
                },
            },
        });
        if (!hasPurchased) {
            throw ApiError_1.ApiError.forbidden('You can only review products you have purchased and received.');
        }
        // Check for existing review
        const existingReview = await database_config_1.prisma.review.findUnique({
            where: { userId_productId: { userId, productId: dto.productId } },
        });
        if (existingReview) {
            throw ApiError_1.ApiError.conflict('You have already reviewed this product');
        }
        const review = await database_config_1.prisma.review.create({
            data: {
                userId,
                productId: dto.productId,
                rating: dto.rating,
                comment: dto.comment,
                images: dto.images || [],
            },
            include: {
                user: { select: { id: true, name: true, profileImage: true } },
            },
        });
        // Recalculate product rating
        await recalculateProductRating(dto.productId);
        return review;
    },
    getProductReviews: async (productId, params) => {
        const { page = 1, limit = 10 } = params;
        const skip = (page - 1) * limit;
        const [reviews, total] = await database_config_1.prisma.$transaction([
            database_config_1.prisma.review.findMany({
                where: { productId },
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, name: true, profileImage: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            database_config_1.prisma.review.count({ where: { productId } }),
        ]);
        const ratingBreakdown = await database_config_1.prisma.review.groupBy({
            by: ['rating'],
            where: { productId },
            _count: { rating: true },
        });
        return { reviews, total, page, limit, ratingBreakdown };
    },
    deleteReview: async (reviewId, userId, role) => {
        const review = await database_config_1.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw ApiError_1.ApiError.notFound('Review not found');
        if (role !== 'ADMIN' && review.userId !== userId) {
            throw ApiError_1.ApiError.forbidden('You can only delete your own reviews');
        }
        await database_config_1.prisma.review.delete({ where: { id: reviewId } });
        await recalculateProductRating(review.productId);
    },
};
//# sourceMappingURL=review.service.js.map