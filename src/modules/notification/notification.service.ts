import crypto from 'crypto';
import { prisma } from '../../shared/config/database.config';
import { ApiError } from '../../shared/utils/ApiError';
import { ICreateNotificationDTO } from './notification.interface';

export const notificationService = {
  create: async (dto: ICreateNotificationDTO) => {
    return prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId: dto.userId,
        title: dto.title,
        message: dto.message,
        type: dto.type,
        data: dto.data ? (dto.data as any) : undefined,
      },
    });
  },

  getUserNotifications: async (userId: string, params: any) => {
    const { page = 1, limit = 20, unreadOnly } = params;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const [notifications, total] = await prisma.$transaction([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, total, page, limit };
  },

  markAsRead: async (notificationId: string, userId: string) => {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) throw ApiError.notFound('Notification not found');
    if (notification.userId !== userId) throw ApiError.forbidden('Access denied');

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },

  markAllAsRead: async (userId: string) => {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },
};
