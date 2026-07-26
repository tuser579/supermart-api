import { IAddToCartDTO, IUpdateCartItemDTO } from './cart.interface';
export declare const cartService: {
    getCart: (userId: string) => Promise<{
        itemCount: number;
        items: ({
            product: {
                id: string;
                name: string;
                isActive: boolean;
                price: number;
                discountPrice: number | null;
                stock: number;
                images: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalAmount: number;
    }>;
    addItem: (userId: string, dto: IAddToCartDTO) => Promise<{
        itemCount: number;
        items: ({
            product: {
                id: string;
                name: string;
                isActive: boolean;
                price: number;
                discountPrice: number | null;
                stock: number;
                images: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalAmount: number;
    }>;
    updateItem: (userId: string, itemId: string, dto: IUpdateCartItemDTO) => Promise<{
        itemCount: number;
        items: ({
            product: {
                id: string;
                name: string;
                isActive: boolean;
                price: number;
                discountPrice: number | null;
                stock: number;
                images: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalAmount: number;
    }>;
    removeItem: (userId: string, itemId: string) => Promise<{
        itemCount: number;
        items: ({
            product: {
                id: string;
                name: string;
                isActive: boolean;
                price: number;
                discountPrice: number | null;
                stock: number;
                images: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalAmount: number;
    }>;
    clearCart: (userId: string) => Promise<void>;
};
//# sourceMappingURL=cart.service.d.ts.map