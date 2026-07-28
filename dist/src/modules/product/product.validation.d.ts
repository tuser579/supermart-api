import { z } from 'zod';
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    price: z.ZodEffects<z.ZodNumber, number, unknown>;
    discountPrice: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, unknown>;
    category: z.ZodString;
    brand: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    stock: z.ZodEffects<z.ZodNumber, number, unknown>;
    images: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], unknown>;
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
    category: string;
    description?: unknown;
    price?: unknown;
    discountPrice?: unknown;
    brand?: unknown;
    stock?: unknown;
    images?: unknown;
}>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>>;
    price: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, unknown>>;
    discountPrice: z.ZodOptional<z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, unknown>>;
    category: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>>;
    stock: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, unknown>>;
    images: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], unknown>>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    imageUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    discountPrice?: number | undefined;
    category?: string | undefined;
    brand?: string | undefined;
    stock?: number | undefined;
    images?: string[] | undefined;
    image?: string | undefined;
    imageUrl?: string | undefined;
}, {
    name?: string | undefined;
    description?: unknown;
    price?: unknown;
    discountPrice?: unknown;
    category?: string | undefined;
    brand?: unknown;
    stock?: unknown;
    images?: unknown;
    image?: string | undefined;
    imageUrl?: string | undefined;
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
    outOfStock: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    lowStock: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    includeInactive: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
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
    outOfStock?: "true" | "false" | undefined;
    lowStock?: "true" | "false" | undefined;
    includeInactive?: "true" | "false" | undefined;
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
    outOfStock?: "true" | "false" | undefined;
    lowStock?: "true" | "false" | undefined;
    includeInactive?: "true" | "false" | undefined;
}>;
export declare const restockProductSchema: z.ZodEffects<z.ZodObject<{
    stock: z.ZodOptional<z.ZodNumber>;
    addStock: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    stock?: number | undefined;
    addStock?: number | undefined;
}, {
    stock?: number | undefined;
    addStock?: number | undefined;
}>, {
    stock?: number | undefined;
    addStock?: number | undefined;
}, {
    stock?: number | undefined;
    addStock?: number | undefined;
}>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type RestockProductInput = z.infer<typeof restockProductSchema>;
//# sourceMappingURL=product.validation.d.ts.map