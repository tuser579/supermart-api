import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { notificationService } from './notification.service';

export const notificationController = {
  getNotifications: asyncHandler(async (req: Request, res: Response) => {
    const notifications = await notificationService.getUserNotifications(
      req.user!.userId,
      req.query
    );
    res.status(200).json(
      ApiResponse.success('Notifications fetched successfully', notifications)
    );
  }),

  markAsRead: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAsRead(
      req.params.id as string,
      req.user!.userId
    );
    res.status(200).json(
      ApiResponse.success('Notification marked as read', {
        message: 'Notification marked as read',
      })
    );
  }),

  markAllAsRead: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAllAsRead(req.user!.userId);
    res.status(200).json(
      ApiResponse.success('All notifications marked as read', {
        message: 'All notifications marked as read',
      })
    );
  }),

  deleteNotification: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.deleteNotification(req.params.id as string, req.user!.userId);
    res.status(200).json(
      ApiResponse.success('Notification deleted successfully', {
        message: 'Notification deleted',
      })
    );
  }),

  deleteAllNotifications: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.deleteAllNotifications(req.user!.userId);
    res.status(200).json(
      ApiResponse.success('All notifications cleared from database', {
        message: 'Cleared',
      })
    );
  }),
};
