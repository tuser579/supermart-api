import { ICreateReviewDTO } from './review.interface';
export declare const reviewService: {
    createReview: (userId: string, dto: ICreateReviewDTO) => Promise<{
        user: {
            id: string;
            name: string;
            profileImage: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        images: string[];
        rating: number;
        productId: string;
        comment: string | null;
    }>;
    getProductReviews: (productId: string, params: any) => Promise<{
        reviews: ({
            user: {
                id: string;
                name: string;
                profileImage: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            images: string[];
            rating: number;
            productId: string;
            comment: string | null;
        })[];
        total: number;
        page: any;
        limit: any;
        ratingBreakdown: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReviewGroupByOutputType, "rating"[]> & {
            _count: {
                rating: number;
            };
        })[];
    }>;
    deleteReview: (reviewId: string, userId: string, role: string) => Promise<void>;
};
//# sourceMappingURL=review.service.d.ts.map