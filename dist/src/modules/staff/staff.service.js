"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffService = void 0;
const database_config_1 = require("../../shared/config/database.config");
const ApiError_1 = require("../../shared/utils/ApiError");
const hashPassword_1 = require("../../shared/utils/hashPassword");
const client_1 = require("@prisma/client");
let staffCounter = 1;
const generateStaffId = () => {
    return `STAFF-${String(staffCounter++).padStart(4, '0')}`;
};
exports.staffService = {
    createStaff: async (dto) => {
        const existingEmail = await database_config_1.prisma.user.findUnique({ where: { email: dto.email } });
        if (existingEmail)
            throw ApiError_1.ApiError.conflict('Email already registered');
        const existingPhone = await database_config_1.prisma.user.findUnique({ where: { phone: dto.phone } });
        if (existingPhone)
            throw ApiError_1.ApiError.conflict('Phone number already registered');
        const passwordHash = await (0, hashPassword_1.hashPassword)(dto.password);
        const user = await database_config_1.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                phone: dto.phone,
                passwordHash,
                role: client_1.Role.STAFF,
                isVerified: true,
                staffProfile: {
                    create: {
                        staffId: generateStaffId(),
                        position: dto.position,
                        shift: dto.shift,
                        salary: dto.salary,
                        assignedArea: dto.assignedArea || [],
                    },
                },
            },
            include: {
                staffProfile: true,
            },
        });
        return user;
    },
    getAllStaff: async (params) => {
        const { page = 1, limit = 20, position, isAvailable } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (position)
            where.position = position;
        if (isAvailable !== undefined)
            where.isAvailable = isAvailable;
        const [staff, total] = await database_config_1.prisma.$transaction([
            database_config_1.prisma.staff.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: { id: true, name: true, email: true, phone: true, profileImage: true, isActive: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            database_config_1.prisma.staff.count({ where }),
        ]);
        return { staff, total, page, limit };
    },
    getStaffProfile: async (userId) => {
        const staff = await database_config_1.prisma.staff.findUnique({
            where: { userId },
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true, profileImage: true },
                },
            },
        });
        if (!staff)
            throw ApiError_1.ApiError.notFound('Staff profile not found');
        return staff;
    },
    getStaffOrders: async (userId, params) => {
        const staff = await database_config_1.prisma.staff.findUnique({ where: { userId } });
        if (!staff)
            throw ApiError_1.ApiError.notFound('Staff profile not found');
        const { page = 1, limit = 20, status } = params;
        const skip = (page - 1) * limit;
        const where = { assignedStaffId: staff.id };
        if (status)
            where.status = status;
        const [orders, total] = await database_config_1.prisma.$transaction([
            database_config_1.prisma.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, name: true, phone: true } },
                    items: {
                        include: { product: { select: { name: true, images: true } } },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            database_config_1.prisma.order.count({ where }),
        ]);
        return { orders, total, page, limit };
    },
    markAttendance: async (userId, dto) => {
        const staff = await database_config_1.prisma.staff.findUnique({ where: { userId } });
        if (!staff)
            throw ApiError_1.ApiError.notFound('Staff profile not found');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        // Check existing attendance for today
        const existingAttendance = await database_config_1.prisma.attendance.findFirst({
            where: {
                staffId: staff.id,
                date: { gte: today, lt: tomorrow },
            },
        });
        if (existingAttendance) {
            // Update check-out
            if (dto.checkOut) {
                return database_config_1.prisma.attendance.update({
                    where: { id: existingAttendance.id },
                    data: { checkOut: new Date(dto.checkOut) },
                });
            }
            throw ApiError_1.ApiError.conflict('Attendance already marked for today. Use checkout.');
        }
        // Mark check-in
        return database_config_1.prisma.attendance.create({
            data: {
                staffId: staff.id,
                checkIn: dto.checkIn ? new Date(dto.checkIn) : new Date(),
                checkOut: dto.checkOut ? new Date(dto.checkOut) : undefined,
                status: dto.status || 'PRESENT',
            },
        });
    },
    getAttendance: async (userId, role, targetStaffId) => {
        let staffId;
        if (role === 'ADMIN' && targetStaffId) {
            staffId = targetStaffId;
        }
        else {
            const staff = await database_config_1.prisma.staff.findUnique({ where: { userId } });
            if (!staff)
                throw ApiError_1.ApiError.notFound('Staff profile not found');
            staffId = staff.id;
        }
        return database_config_1.prisma.attendance.findMany({
            where: { staffId },
            orderBy: { date: 'desc' },
            take: 30,
        });
    },
    getEarnings: async (userId) => {
        const staff = await database_config_1.prisma.staff.findUnique({
            where: { userId },
            select: { earnings: true, totalDeliveries: true, rating: true, salary: true },
        });
        if (!staff)
            throw ApiError_1.ApiError.notFound('Staff profile not found');
        const deliveredOrders = await database_config_1.prisma.order.count({
            where: {
                assignedStaff: { userId },
                status: 'DELIVERED',
            },
        });
        return { ...staff, deliveredOrders };
    },
    updateAvailability: async (userId, isAvailable) => {
        const staff = await database_config_1.prisma.staff.findUnique({ where: { userId } });
        if (!staff)
            throw ApiError_1.ApiError.notFound('Staff profile not found');
        return database_config_1.prisma.staff.update({
            where: { userId },
            data: { isAvailable },
        });
    },
};
//# sourceMappingURL=staff.service.js.map