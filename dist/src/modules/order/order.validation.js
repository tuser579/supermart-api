"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payOrderSchema = exports.orderQuerySchema = exports.assignDeliverySchema = exports.returnOrderSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const deliveryAddressSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, 'Full name is required'),
    phone: zod_1.z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
    addressLine1: zod_1.z.string().min(5, 'Address is required'),
    addressLine2: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1, 'City is required'),
    area: zod_1.z.string().min(1, 'Area is required'),
    postalCode: zod_1.z.string().optional(),
});
exports.createOrderSchema = zod_1.z.object({
    deliveryAddress: deliveryAddressSchema,
    notes: zod_1.z.string().max(500).optional(),
    paymentMethod: zod_1.z.enum(['COD', 'BKASH', 'ROCKET', 'NOGOD', 'BANK_TRANSFER', 'CARD']),
    transactionId: zod_1.z.string().optional(),
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string().min(1, 'Invalid product ID'),
        quantity: zod_1.z.number().int().positive('Quantity must be positive'),
    })).optional(),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED']),
    cancellationReason: zod_1.z.string().max(500).optional(),
});
exports.returnOrderSchema = zod_1.z.object({
    reason: zod_1.z.string().min(3, 'Return reason is required').max(200),
    details: zod_1.z.string().max(1000).optional(),
    images: zod_1.z.array(zod_1.z.string()).max(5).optional(),
});
exports.assignDeliverySchema = zod_1.z.object({
    staffId: zod_1.z.string().cuid('Invalid staff ID'),
});
exports.orderQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    status: zod_1.z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED']).optional(),
});
exports.payOrderSchema = zod_1.z.object({
    paymentMethod: zod_1.z.enum(['COD', 'BKASH', 'ROCKET', 'NOGOD', 'BANK_TRANSFER', 'CARD']),
    transactionId: zod_1.z.string().optional(),
});
//# sourceMappingURL=order.validation.js.map