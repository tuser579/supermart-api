"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restockProductSchema = exports.productQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Product name must be at least 2 characters').max(200).trim(),
    description: zod_1.z.preprocess((v) => (v === null || v === '' ? undefined : v), zod_1.z.string().max(2000).trim().optional()),
    price: zod_1.z.preprocess((v) => (v === undefined || v === null || v === '' ? 0 : Number(v)), zod_1.z.number().positive('Price must be positive')),
    discountPrice: zod_1.z.preprocess((v) => (v === undefined || v === null || v === '' || isNaN(Number(v)) ? undefined : Number(v)), zod_1.z.number().positive().optional()),
    category: zod_1.z.string().min(1, 'Category is required').trim(),
    brand: zod_1.z.preprocess((v) => (v === null || v === '' ? undefined : v), zod_1.z.string().trim().optional()),
    stock: zod_1.z.preprocess((v) => (v === undefined || v === null || v === '' ? 0 : Number(v)), zod_1.z.number().int().nonnegative('Stock cannot be negative')),
    images: zod_1.z.preprocess((val) => {
        if (typeof val === 'string' && val.trim().length > 0)
            return [val.trim()];
        if (Array.isArray(val) && val.length > 0)
            return val.filter((item) => typeof item === 'string' && item.trim().length > 0);
        return ['https://placehold.co/400x300?text=Product'];
    }, zod_1.z.array(zod_1.z.string()).min(1, 'At least one image required').max(10)),
});
exports.updateProductSchema = exports.createProductSchema
    .extend({
    image: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().optional(),
})
    .partial();
exports.productQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    search: zod_1.z.string().trim().optional(),
    category: zod_1.z.string().trim().optional(),
    minPrice: zod_1.z.coerce.number().nonnegative().optional(),
    maxPrice: zod_1.z.coerce.number().positive().optional(),
    sortBy: zod_1.z.enum(['price', 'rating', 'createdAt', 'name']).default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
    inStock: zod_1.z.coerce.boolean().optional(),
    outOfStock: zod_1.z.enum(['true', 'false']).optional(),
    lowStock: zod_1.z.enum(['true', 'false']).optional(),
    includeInactive: zod_1.z.enum(['true', 'false']).optional(),
});
exports.restockProductSchema = zod_1.z
    .object({
    stock: zod_1.z.number().int().nonnegative().optional(),
    addStock: zod_1.z.number().int().positive().optional(),
})
    .refine((data) => data.stock !== undefined || data.addStock !== undefined, {
    message: 'Either stock or addStock must be provided',
});
//# sourceMappingURL=product.validation.js.map