import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').max(200).trim(),
  description: z.string().max(2000).trim().optional(),
  price: z.number().positive('Price must be positive'),
  discountPrice: z.number().positive().optional(),
  category: z.string().min(1, 'Category is required').trim(),
  brand: z.string().trim().optional(),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  images: z.array(z.string().url('Each image must be a valid URL')).min(1, 'At least one image required').max(10),
});

export const updateProductSchema = createProductSchema.partial();

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
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
