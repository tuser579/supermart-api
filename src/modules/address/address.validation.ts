import { z } from 'zod';

export const createAddressSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50).trim(),
  fullName: z.string().min(2, 'Full name is required').max(100).trim(),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  addressLine1: z.string().min(1, 'Address line 1 is required').max(200).trim(),
  addressLine2: z.string().max(200).trim().optional(),
  city: z.string().min(1, 'City is required').max(100).trim(),
  area: z.string().min(1, 'Area is required').max(100).trim(),
  postalCode: z.string().max(20).trim().optional(),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = z.object({
  label: z.string().min(1).max(50).trim().optional(),
  fullName: z.string().min(2).max(100).trim().optional(),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number').optional(),
  addressLine1: z.string().min(1).max(200).trim().optional(),
  addressLine2: z.string().max(200).trim().optional(),
  city: z.string().min(1).max(100).trim().optional(),
  area: z.string().min(1).max(100).trim().optional(),
  postalCode: z.string().max(20).trim().optional(),
  isDefault: z.boolean().optional(),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
