import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { userService } from './user.service';

export const userController = {
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await userService.getProfile(userId);
    res.status(200).json(ApiResponse.success('Profile retrieved', user));
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await userService.updateProfile(userId, req.body);
    res.status(200).json(ApiResponse.success('Profile updated successfully', user));
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    await userService.changePassword(userId, req.body);
    res.status(200).json(ApiResponse.success('Password changed successfully', null));
  }),

  deleteAccount: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    await userService.deleteAccount(userId);
    res.status(200).json(ApiResponse.success('Account deactivated successfully', null));
  }),
};
