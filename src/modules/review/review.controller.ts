import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { reviewService } from './review.service';

export const reviewController = {
  createReview: asyncHandler(async (req: Request, res: Response) => {
    const review = await reviewService.createReview(req.user!.userId, req.body);
    res.status(201).json(ApiResponse.created('Review submitted successfully', review));
  }),

  getProductReviews: asyncHandler(async (req: Request, res: Response) => {
    const result = await reviewService.getProductReviews(req.params.productId as string, req.query);
    res.status(200).json(
      ApiResponse.paginated(
        'Reviews retrieved',
        result.reviews,
        result.page,
        result.limit,
        result.total,
      )
    );
  }),

  deleteReview: asyncHandler(async (req: Request, res: Response) => {
    await reviewService.deleteReview(req.params.id as string, req.user!.userId, req.user!.role);
    res.status(200).json(ApiResponse.success('Review deleted successfully', null));
  }),
};
