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

  getUserNotifications: async (userId: string, params?: any) => {
    const where: any = { userId };
    if (params?.unreadOnly === 'true') {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        title: true,
        message: true,
        type: true,
        isRead: true,
        createdAt: true,
      },
    });

    return notifications;
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

  deleteNotification: async (notificationId: string, userId: string) => {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) throw ApiError.notFound('Notification not found');
    if (notification.userId !== userId) throw ApiError.forbidden('Access denied');

    return prisma.notification.delete({
      where: { id: notificationId },
    });
  },

  deleteAllNotifications: async (userId: string) => {
    return prisma.notification.deleteMany({
      where: { userId },
    });
  },
};
