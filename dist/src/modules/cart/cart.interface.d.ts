export interface IAddToCartDTO {
    productId: string;
    quantity: number;
}
export interface IUpdateCartItemDTO {
    quantity: number;
}
export interface ICartItemResponse {
    id: string;
    productId: string;
    product: {
        id: string;
        name: string;
        price: number;
        discountPrice?: number | null;
        images: string[];
        stock: number;
    };
    quantity: number;
    price: number;
}
export interface ICartResponse {
    id: string;
    userId: string;
    items: ICartItemResponse[];
    totalAmount: number;
    itemCount: number;
}
//# sourceMappingURL=cart.interface.d.ts.map