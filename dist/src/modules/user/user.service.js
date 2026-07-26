"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const database_config_1 = require("../../shared/config/database.config");
const hashPassword_1 = require("../../shared/utils/hashPassword");
const ApiError_1 = require("../../shared/utils/ApiError");
const userSelectFields = {
    id: true,
    name: true,
    email: true,
    phone: true,
    role: true,
    profileImage: true,
    isVerified: true,
    isActive: true,
    lastLogin: true,
    createdAt: true,
};
exports.userService = {
    getProfile: async (userId) => {
        const user = await database_config_1.prisma.user.findUnique({
            where: { id: userId },
            select: userSelectFields,
        });
        if (!user)
            throw ApiError_1.ApiError.notFound('User not found');
        return user;
    },
    updateProfile: async (userId, dto) => {
        // Check phone uniqueness if changing
        if (dto.phone) {
            const existing = await database_config_1.prisma.user.findFirst({
                where: { phone: dto.phone, NOT: { id: userId } },
            });
            if (existing)
                throw ApiError_1.ApiError.conflict('Phone number is already in use');
        }
        const user = await database_config_1.prisma.user.update({
            where: { id: userId },
            data: dto,
            select: userSelectFields,
        });
        return user;
    },
    changePassword: async (userId, dto) => {
        const user = await database_config_1.prisma.user.findUnique({
            where: { id: userId },
            select: { passwordHash: true },
        });
        if (!user)
            throw ApiError_1.ApiError.notFound('User not found');
        const isValid = await (0, hashPassword_1.comparePassword)(dto.currentPassword, user.passwordHash);
        if (!isValid)
            throw ApiError_1.ApiError.badRequest('Current password is incorrect');
        const newHash = await (0, hashPassword_1.hashPassword)(dto.newPassword);
        await database_config_1.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newHash },
        });
    },
    deleteAccount: async (userId) => {
        await database_config_1.prisma.user.update({
            where: { id: userId },
            data: { isActive: false },
        });
    },
    savePushToken: async (userId, token) => {
        await database_config_1.prisma.user.update({
            where: { id: userId },
            data: { expoPushToken: token },
        });
    },
};
//# sourceMappingURL=user.service.js.map