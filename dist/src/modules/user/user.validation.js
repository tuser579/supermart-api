"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).trim().optional(),
    email: zod_1.z.string().email('Invalid email address').trim().toLowerCase().optional(),
    phone: zod_1.z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number').optional(),
    profileImage: zod_1.z.string().min(1, 'Profile image URL or data string cannot be empty').optional(),
    avatar: zod_1.z.string().min(1, 'Avatar URL or data string cannot be empty').optional(),
    photo: zod_1.z.string().min(1, 'Photo URL or data string cannot be empty').optional(),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain uppercase letter')
        .regex(/[a-z]/, 'Must contain lowercase letter')
        .regex(/[0-9]/, 'Must contain a number')
        .regex(/[@$!%*?&]/, 'Must contain a special character'),
});
//# sourceMappingURL=user.validation.js.map