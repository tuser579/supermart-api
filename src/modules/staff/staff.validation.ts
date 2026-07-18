import { z } from 'zod';

export const createStaffSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  password: z.string().min(8),
  position: z.enum(['DELIVERY_BOY', 'SUPPORT', 'WAREHOUSE', 'MANAGER']),
  shift: z.enum(['MORNING', 'EVENING', 'NIGHT']).optional(),
  salary: z.number().positive().optional(),
  assignedArea: z.array(z.string()).optional(),
});

export const markAttendanceSchema = z.object({
  checkIn: z.string().datetime().optional(),
  checkOut: z.string().datetime().optional(),
  status: z.enum(['PRESENT', 'ABSENT', 'LEAVE', 'LATE']).optional(),
});

export const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
