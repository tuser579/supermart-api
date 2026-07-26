import { z } from 'zod';

const deliveryAddressSchema = z.object({
  fullName: z.preprocess((v) => (v ? String(v).trim() : 'Valued Customer'), z.string().min(1)),
  phone: z.preprocess(
    (v) => {
      const cleaned = v ? String(v).replace(/[^0-9+]/g, '') : '';
      return cleaned.length >= 7 ? cleaned : '01700000000';
    },
    z.string().min(1)
  ),
  addressLine1: z.preprocess(
    (v) => {
      const str = v ? String(v).trim() : '';
      return str.length < 2 ? 'Default Delivery Address, Dhaka' : str;
    },
    z.string().min(1)
  ),
  addressLine2: z.string().optional(),
  city: z.preprocess((v) => (v ? String(v).trim() : 'Dhaka'), z.string().min(1)),
  area: z.preprocess((v) => (v ? String(v).trim() : 'Central'), z.string().min(1)),
  postalCode: z.string().optional(),
});

export const createOrderSchema = z.object({
  deliveryAddress: deliveryAddressSchema,
  notes: z.string().max(500).optional(),
  paymentMethod: z.preprocess(
    (v) => (v && typeof v === 'string' ? v.toUpperCase() : 'COD'),
    z.enum(['COD', 'BKASH', 'ROCKET', 'NOGOD', 'BANK_TRANSFER', 'CARD'])
  ),
  transactionId: z.string().optional(),
  items: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : []),
      z.array(
        z.object({
          productId: z.preprocess((v) => (v ? String(v).trim() : ''), z.string().min(1)),
          quantity: z.preprocess(
            (v) => {
              const num = Number(v);
              return isNaN(num) || num < 1 ? 1 : Math.round(num);
            },
            z.number().int().positive()
          ),
        })
      )
    )
    .optional(),
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
  staffId: z.string().min(1, 'Invalid staff ID'),
});

export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED']).optional(),
  staffId: z.string().optional(),
  assigned: z.enum(['true', 'false']).optional(),
});

export const payOrderSchema = z.object({
  paymentMethod: z.enum(['COD', 'BKASH', 'ROCKET', 'NOGOD', 'BANK_TRANSFER', 'CARD']),
  transactionId: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type ReturnOrderInput = z.infer<typeof returnOrderSchema>;
export type PayOrderInput = z.infer<typeof payOrderSchema>;


