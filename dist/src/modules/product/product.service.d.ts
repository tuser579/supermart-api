import { ICreateProductDTO, IUpdateProductDTO, IProductQueryParams } from './product.interface';
export declare const productService: {
    createProduct: (dto: ICreateProductDTO, createdBy: string) => Promise<{
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
    }>;
    getAllProducts: (params: IProductQueryParams) => Promise<{
        products: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            description: string | null;
            price: number;
            discountPrice: number | null;
            category: string;
            brand: string | null;
            stock: number;
            images: string[];
            rating: number;
            ratingCount: number;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getProductById: (id: string) => Promise<{
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
    } & {
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
    }>;
    updateProduct: (id: string, dto: IUpdateProductDTO & {
        image?: string;
        imageUrl?: string;
    }) => Promise<{
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
    }>;
    deleteProduct: (id: string) => Promise<void>;
    updateStock: (id: string, quantity: number) => Promise<void>;
    getCategories: () => Promise<string[]>;
};
//# sourceMappingURL=product.service.d.ts.map