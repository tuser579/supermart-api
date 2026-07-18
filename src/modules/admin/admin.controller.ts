import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { adminService } from './admin.service';

export const adminController = {
  getDashboard: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await adminService.getDashboardStats();
    res.status(200).json(ApiResponse.success('Dashboard statistics retrieved', stats));
  }),

  getSalesReport: asyncHandler(async (req: Request, res: Response) => {
    const { period, days } = req.query as any;
    const report = await adminService.getSalesReport(period, parseInt(days || '30'));
    res.status(200).json(ApiResponse.success('Sales report retrieved', report));
  }),

  getTopProducts: asyncHandler(async (req: Request, res: Response) => {
    const { limit } = req.query as any;
    const products = await adminService.getTopProducts(parseInt(limit || '10'));
    res.status(200).json(ApiResponse.success('Top products retrieved', products));
  }),

  getAllUsers: asyncHandler(async (req: Request, res: Response) => {
    const { users, total, page, limit } = await adminService.getAllUsers(req.query);
    res.status(200).json(ApiResponse.paginated('Users retrieved', users, page, limit, total));
  }),

  toggleUserStatus: asyncHandler(async (req: Request, res: Response) => {
    const user = await adminService.toggleUserStatus(req.params.userId as string);
    res.status(200).json(
      ApiResponse.success(`User ${user.isActive ? 'activated' : 'deactivated'}`, user)
    );
  }),

  getStaffPerformance: asyncHandler(async (_req: Request, res: Response) => {
    const performance = await adminService.getStaffPerformance();
    res.status(200).json(ApiResponse.success('Staff performance retrieved', performance));
  }),
};
