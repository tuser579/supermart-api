"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const database_config_1 = require("../../shared/config/database.config");
const ApiError_1 = require("../../shared/utils/ApiError");
exports.notificationService = {
    create: async (dto) => {
        return database_config_1.prisma.notification.create({
            data: {
                id: crypto_1.default.randomUUID(),
                userId: dto.userId,
                title: dto.title,
                message: dto.message,
                type: dto.type,
                data: dto.data ? dto.data : undefined,
            },
        });
    },
    getUserNotifications: async (userId, params) => {
        const { page = 1, limit = 20, unreadOnly } = params;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (unreadOnly === 'true') {
            where.isRead = false;
        }
        const [notifications, total] = await database_config_1.prisma.$transaction([
            database_config_1.prisma.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            database_config_1.prisma.notification.count({ where }),
        ]);
        return { notifications, total, page, limit };
    },
    markAsRead: async (notificationId, userId) => {
        const notification = await database_config_1.prisma.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification)
            throw ApiError_1.ApiError.notFound('Notification not found');
        if (notification.userId !== userId)
            throw ApiError_1.ApiError.forbidden('Access denied');
        return database_config_1.prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    },
    markAllAsRead: async (userId) => {
        return database_config_1.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    },
    deleteNotification: async (notificationId, userId) => {
        const notification = await database_config_1.prisma.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification)
            throw ApiError_1.ApiError.notFound('Notification not found');
        if (notification.userId !== userId)
            throw ApiError_1.ApiError.forbidden('Access denied');
        return database_config_1.prisma.notification.delete({
            where: { id: notificationId },
        });
    },
};
//# sourceMappingURL=notification.service.js.map