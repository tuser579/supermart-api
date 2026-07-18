import { prisma } from '../../shared/config/database.config';
import { ApiError } from '../../shared/utils/ApiError';
import { ICreateReviewDTO } from './review.interface';

const recalculateProductRating = async (productId: string): Promise<void> => {
  const result = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: Math.round((result._avg.rating || 0) * 10) / 10,
      ratingCount: result._count.rating,
    },
  });
};

export const reviewService = {
  createReview: async (userId: string, dto: ICreateReviewDTO) => {
    // Check product exists
    const product = await prisma.product.findUnique({ where: { id: dto.productId, isActive: true } });
    if (!product) throw ApiError.notFound('Product not found');

    // Check if user has purchased the product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: dto.productId,
        order: {
          userId,
          status: 'DELIVERED',
        },
      },
    });

    if (!hasPurchased) {
      throw ApiError.forbidden('You can only review products you have purchased and received.');
    }

    // Check for existing review
    const existingReview = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId: dto.productId } },
    });
    if (existingReview) {
      throw ApiError.conflict('You have already reviewed this product');
    }

    const review = await prisma.review.create({
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

  getProductReviews: async (productId: string, params: any) => {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [reviews, total] = await prisma.$transaction([
      prisma.review.findMany({
        where: { productId },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, profileImage: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { productId } }),
    ]);

    const ratingBreakdown = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId },
      _count: { rating: true },
    });

    return { reviews, total, page, limit, ratingBreakdown };
  },

  deleteReview: async (reviewId: string, userId: string, role: string) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw ApiError.notFound('Review not found');

    if (role !== 'ADMIN' && review.userId !== userId) {
      throw ApiError.forbidden('You can only delete your own reviews');
    }

    await prisma.review.delete({ where: { id: reviewId } });
    await recalculateProductRating(review.productId);
  },
};
