import { Router } from 'express';
import { reviewController } from './review.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { requireRole } from '../../shared/middleware/role.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const createReviewSchema = z.object({
  productId: z.string().min(1, 'Invalid product ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(1000).optional(),
  images: z.array(z.string().url()).max(5).optional(),
});

// GET /api/v1/reviews/product/:productId — Public
router.get('/product/:productId', reviewController.getProductReviews);

// POST /api/v1/reviews — USER (verified purchase)
router.post(
  '/',
  authMiddleware,
  requireRole('USER'),
  validate(createReviewSchema),
  reviewController.createReview
);

// DELETE /api/v1/reviews/:id — own review or ADMIN
router.delete('/:id', authMiddleware, requireRole('USER', 'ADMIN'), reviewController.deleteReview);

export default router;
