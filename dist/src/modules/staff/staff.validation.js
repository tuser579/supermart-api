"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAvailabilitySchema = exports.markAttendanceSchema = exports.createStaffSchema = void 0;
const zod_1 = require("zod");
exports.createStaffSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).trim(),
    email: zod_1.z.string().email().toLowerCase().trim(),
    phone: zod_1.z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
    password: zod_1.z.string().min(8),
    position: zod_1.z.enum(['DELIVERY_BOY', 'SUPPORT', 'WAREHOUSE', 'MANAGER']),
    shift: zod_1.z.enum(['MORNING', 'EVENING', 'NIGHT']).optional(),
    salary: zod_1.z.number().positive().optional(),
    assignedArea: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.markAttendanceSchema = zod_1.z.object({
    checkIn: zod_1.z.string().datetime().optional(),
    checkOut: zod_1.z.string().datetime().optional(),
    status: zod_1.z.enum(['PRESENT', 'ABSENT', 'LEAVE', 'LATE']).optional(),
});
exports.updateAvailabilitySchema = zod_1.z.object({
    isAvailable: zod_1.z.boolean(),
});
//# sourceMappingURL=staff.validation.js.map