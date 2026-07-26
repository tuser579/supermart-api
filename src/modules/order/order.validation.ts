import { z } from 'zod';

const deliveryAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  area: z.string().min(1, 'Area is required'),
  postalCode: z.string().optional(),
});

export const createOrderSchema = z.object({
  deliveryAddress: deliveryAddressSchema,
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(['COD', 'BKASH', 'ROCKET', 'NOGOD', 'BANK_TRANSFER', 'CARD']),
  transactionId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'Invalid product ID'),
    quantity: z.number().int().positive('Quantity must be positive'),
  })).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED']),
  cancellationReason: z.string().max(500).optional(),
});

export const returnOrderSchema = z.object({
  reason: z.string().min(3, 'Return reason is required').max(200),
  details: z.string().max(1000).optional(),
  images: z.array(z.string()).max(5).optional(),
});

export const assignDeliverySchema = z.object({
  staffId: z.string().cuid('Invalid staff ID'),
});

export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED']).optional(),
});

export const payOrderSchema = z.object({
  paymentMethod: z.enum(['COD', 'BKASH', 'ROCKET', 'NOGOD', 'BANK_TRANSFER', 'CARD']),
  transactionId: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type ReturnOrderInput = z.infer<typeof returnOrderSchema>;
export type PayOrderInput = z.infer<typeof payOrderSchema>;


