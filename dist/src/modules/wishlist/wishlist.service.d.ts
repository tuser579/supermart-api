export declare const getWishlist: (userId: string) => Promise<({
    product: {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        discountPrice: number | null;
        category: string;
        brand: string | null;
        stock: number;
        images: string[];
        rating: number;
        ratingCount: number;
        createdBy: string;
    };
} & {
    id: string;
    createdAt: Date;
    userId: string;
    productId: string;
})[]>;
export declare const addToWishlist: (userId: string, productId: string) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    productId: string;
}>;
export declare const removeFromWishlist: (userId: string, productId: string) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    productId: string;
}>;
//# sourceMappingURL=wishlist.service.d.ts.map