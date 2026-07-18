import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { staffService } from './staff.service';

export const staffController = {
  createStaff: asyncHandler(async (req: Request, res: Response) => {
    const staff = await staffService.createStaff(req.body);
    res.status(201).json(ApiResponse.created('Staff member created successfully', staff));
  }),

  getAllStaff: asyncHandler(async (req: Request, res: Response) => {
    const { staff, total, page, limit } = await staffService.getAllStaff(req.query);
    res.status(200).json(ApiResponse.paginated('Staff retrieved', staff, page, limit, total));
  }),

  getMyProfile: asyncHandler(async (req: Request, res: Response) => {
    const profile = await staffService.getStaffProfile(req.user!.userId);
    res.status(200).json(ApiResponse.success('Staff profile retrieved', profile));
  }),

  getMyOrders: asyncHandler(async (req: Request, res: Response) => {
    const { orders, total, page, limit } = await staffService.getStaffOrders(
      req.user!.userId,
      req.query
    );
    res.status(200).json(ApiResponse.paginated('Staff orders retrieved', orders, page, limit, total));
  }),

  markAttendance: asyncHandler(async (req: Request, res: Response) => {
    const attendance = await staffService.markAttendance(req.user!.userId, req.body);
    res.status(200).json(ApiResponse.success('Attendance marked', attendance));
  }),

  getAttendance: asyncHandler(async (req: Request, res: Response) => {
    const attendance = await staffService.getAttendance(
      req.user!.userId,
      req.user!.role,
      req.query.staffId as string
    );
    res.status(200).json(ApiResponse.success('Attendance records retrieved', attendance));
  }),

  getEarnings: asyncHandler(async (req: Request, res: Response) => {
    const earnings = await staffService.getEarnings(req.user!.userId);
    res.status(200).json(ApiResponse.success('Earnings retrieved', earnings));
  }),

  updateAvailability: asyncHandler(async (req: Request, res: Response) => {
    const staff = await staffService.updateAvailability(req.user!.userId, req.body.isAvailable);
    res.status(200).json(ApiResponse.success('Availability updated', staff));
  }),
};
