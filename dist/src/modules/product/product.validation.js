"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Product name must be at least 2 characters').max(200).trim(),
    description: zod_1.z.string().max(2000).trim().optional(),
    price: zod_1.z.number().positive('Price must be positive'),
    discountPrice: zod_1.z.number().positive().optional(),
    category: zod_1.z.string().min(1, 'Category is required').trim(),
    brand: zod_1.z.string().trim().optional(),
    stock: zod_1.z.number().int().nonnegative('Stock cannot be negative'),
    images: zod_1.z.array(zod_1.z.string().url('Each image must be a valid URL')).min(1, 'At least one image required').max(10),
});
exports.updateProductSchema = exports.createProductSchema.partial();
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
});
//# sourceMappingURL=product.validation.js.map