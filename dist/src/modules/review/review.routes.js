"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const role_middleware_1 = require("../../shared/middleware/role.middleware");
const validation_middleware_1 = require("../../shared/middleware/validation.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const createReviewSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, 'Invalid product ID'),
    rating: zod_1.z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    comment: zod_1.z.string().max(1000).optional(),
    images: zod_1.z.array(zod_1.z.string().url()).max(5).optional(),
});
// GET /api/v1/reviews/product/:productId — Public
router.get('/product/:productId', review_controller_1.reviewController.getProductReviews);
// POST /api/v1/reviews — USER (verified purchase)
router.post('/', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)('USER'), (0, validation_middleware_1.validate)(createReviewSchema), review_controller_1.reviewController.createReview);
// DELETE /api/v1/reviews/:id — own review or ADMIN
router.delete('/:id', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)('USER', 'ADMIN'), review_controller_1.reviewController.deleteReview);
exports.default = router;
//# sourceMappingURL=review.routes.js.map