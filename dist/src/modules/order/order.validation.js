"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payOrderSchema = exports.orderQuerySchema = exports.assignDeliverySchema = exports.returnOrderSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const deliveryAddressSchema = zod_1.z.object({
    fullName: zod_1.z.preprocess((v) => (v ? String(v).trim() : 'Valued Customer'), zod_1.z.string().min(1)),
    phone: zod_1.z.preprocess((v) => {
        const cleaned = v ? String(v).replace(/[^0-9+]/g, '') : '';
        return cleaned.length >= 7 ? cleaned : '01700000000';
    }, zod_1.z.string().min(1)),
    addressLine1: zod_1.z.preprocess((v) => {
        const str = v ? String(v).trim() : '';
        return str.length < 2 ? 'Default Delivery Address, Dhaka' : str;
    }, zod_1.z.string().min(1)),
    addressLine2: zod_1.z.string().optional(),
    city: zod_1.z.preprocess((v) => (v ? String(v).trim() : 'Dhaka'), zod_1.z.string().min(1)),
    area: zod_1.z.preprocess((v) => (v ? String(v).trim() : 'Central'), zod_1.z.string().min(1)),
    postalCode: zod_1.z.string().optional(),
});
exports.createOrderSchema = zod_1.z.object({
    deliveryAddress: deliveryAddressSchema,
    notes: zod_1.z.string().max(500).optional(),
    paymentMethod: zod_1.z.preprocess((v) => (v && typeof v === 'string' ? v.toUpperCase() : 'COD'), zod_1.z.enum(['COD', 'BKASH', 'ROCKET', 'NOGOD', 'BANK_TRANSFER', 'CARD'])),
    transactionId: zod_1.z.string().optional(),
    items: zod_1.z
        .preprocess((val) => (Array.isArray(val) ? val : []), zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.preprocess((v) => (v ? String(v).trim() : ''), zod_1.z.string().min(1)),
        quantity: zod_1.z.preprocess((v) => {
            const num = Number(v);
            return isNaN(num) || num < 1 ? 1 : Math.round(num);
        }, zod_1.z.number().int().positive()),
    })))
        .optional(),
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
    staffId: zod_1.z.string().min(1, 'Invalid staff ID'),
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