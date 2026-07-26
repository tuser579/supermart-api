import { z } from 'zod';
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    discountPrice: z.ZodOptional<z.ZodNumber>;
    category: z.ZodString;
    brand: z.ZodOptional<z.ZodString>;
    stock: z.ZodNumber;
    images: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    price: number;
    category: string;
    stock: number;
    images: string[];
    description?: string | undefined;
    discountPrice?: number | undefined;
    brand?: string | undefined;
}, {
    name: string;
    price: number;
    category: string;
    stock: number;
    images: string[];
    description?: string | undefined;
    discountPrice?: number | undefined;
    brand?: string | undefined;
}>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    price: z.ZodOptional<z.ZodNumber>;
    discountPrice: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    category: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    stock: z.ZodOptional<z.ZodNumber>;
    images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    discountPrice?: number | undefined;
    category?: string | undefined;
    brand?: string | undefined;
    stock?: number | undefined;
    images?: string[] | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    discountPrice?: number | undefined;
    category?: string | undefined;
    brand?: string | undefined;
    stock?: number | undefined;
    images?: string[] | undefined;
}>;
export declare const productQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    sortBy: z.ZodDefault<z.ZodEnum<["price", "rating", "createdAt", "name"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    inStock: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sortBy: "name" | "createdAt" | "price" | "rating";
    sortOrder: "asc" | "desc";
    search?: string | undefined;
    category?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    inStock?: boolean | undefined;
}, {
    limit?: number | undefined;
    page?: number | undefined;
    search?: string | undefined;
    category?: string | undefined;
    sortBy?: "name" | "createdAt" | "price" | "rating" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    inStock?: boolean | undefined;
}>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
//# sourceMappingURL=product.validation.d.ts.map