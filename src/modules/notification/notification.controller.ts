import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { notificationService } from './notification.service';

export const notificationController = {
  getNotifications: asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationService.getUserNotifications(
      req.user!.userId,
      req.query
    );
    res.status(200).json(
      ApiResponse.paginated(
        'Notifications retrieved',
        result.notifications,
        result.page,
        result.limit,
        result.total
      )
    );
  }),

  markAsRead: asyncHandler(async (req: Request, res: Response) => {
    const notification = await notificationService.markAsRead(
      req.params.id as string,
      req.user!.userId
    );
    res.status(200).json(ApiResponse.success('Notification marked as read', notification));
  }),

  markAllAsRead: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAllAsRead(req.user!.userId);
    res.status(200).json(ApiResponse.success('All notifications marked as read', null));
  }),

  deleteNotification: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.deleteNotification(req.params.id as string, req.user!.userId);
    res.status(200).json(ApiResponse.success('Notification deleted successfully', null));
  }),
};
