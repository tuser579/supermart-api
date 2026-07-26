"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressSchema = exports.createAddressSchema = void 0;
const zod_1 = require("zod");
exports.createAddressSchema = zod_1.z.object({
    label: zod_1.z.string().min(1, 'Label is required').max(50).trim(),
    fullName: zod_1.z.string().min(2, 'Full name is required').max(100).trim(),
    phone: zod_1.z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
    addressLine1: zod_1.z.string().min(1, 'Address line 1 is required').max(200).trim(),
    addressLine2: zod_1.z.string().max(200).trim().optional(),
    city: zod_1.z.string().min(1, 'City is required').max(100).trim(),
    area: zod_1.z.string().min(1, 'Area is required').max(100).trim(),
    postalCode: zod_1.z.string().max(20).trim().optional(),
    isDefault: zod_1.z.boolean().optional(),
});
exports.updateAddressSchema = zod_1.z.object({
    label: zod_1.z.string().min(1).max(50).trim().optional(),
    fullName: zod_1.z.string().min(2).max(100).trim().optional(),
    phone: zod_1.z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number').optional(),
    addressLine1: zod_1.z.string().min(1).max(200).trim().optional(),
    addressLine2: zod_1.z.string().max(200).trim().optional(),
    city: zod_1.z.string().min(1).max(100).trim().optional(),
    area: zod_1.z.string().min(1).max(100).trim().optional(),
    postalCode: zod_1.z.string().max(20).trim().optional(),
    isDefault: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=address.validation.js.map