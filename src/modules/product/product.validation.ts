import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').max(200).trim(),
  description: z.preprocess((v) => (v === null || v === '' ? undefined : v), z.string().max(2000).trim().optional()),
  price: z.preprocess((v) => (v === undefined || v === null || v === '' ? 0 : Number(v)), z.number().positive('Price must be positive')),
  discountPrice: z.preprocess(
    (v) => (v === undefined || v === null || v === '' || isNaN(Number(v)) ? undefined : Number(v)),
    z.number().positive().optional()
  ),
  category: z.string().min(1, 'Category is required').trim(),
  brand: z.preprocess((v) => (v === null || v === '' ? undefined : v), z.string().trim().optional()),
  stock: z.preprocess((v) => (v === undefined || v === null || v === '' ? 0 : Number(v)), z.number().int().nonnegative('Stock cannot be negative')),
  images: z.preprocess(
    (val) => {
      if (typeof val === 'string' && val.trim().length > 0) return [val.trim()];
      if (Array.isArray(val) && val.length > 0) return val.filter((item) => typeof item === 'string' && item.trim().length > 0);
      return ['https://placehold.co/400x300?text=Product'];
    },
    z.array(z.string()).min(1, 'At least one image required').max(10)
  ),
});

export const updateProductSchema = createProductSchema
  .extend({
    image: z.string().optional(),
    imageUrl: z.string().optional(),
  })
  .partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  sortBy: z.enum(['price', 'rating', 'createdAt', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  inStock: z.coerce.boolean().optional(),
  outOfStock: z.enum(['true', 'false']).optional(),
  lowStock: z.enum(['true', 'false']).optional(),
  includeInactive: z.enum(['true', 'false']).optional(),
});

export const restockProductSchema = z
  .object({
    stock: z.number().int().nonnegative().optional(),
    addStock: z.number().int().positive().optional(),
  })
  .refine((data) => data.stock !== undefined || data.addStock !== undefined, {
    message: 'Either stock or addStock must be provided',
  });

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type RestockProductInput = z.infer<typeof restockProductSchema>;
