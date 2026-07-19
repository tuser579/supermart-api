import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { addressService } from './address.service';

export const addressController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const addresses = await addressService.list(userId);
    res.status(200).json(ApiResponse.success('Addresses retrieved', addresses));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const address = await addressService.create(userId, req.body);
    res.status(201).json(ApiResponse.created('Address saved successfully', address));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const address = await addressService.update(userId, req.params.id as string, req.body);
    res.status(200).json(ApiResponse.success('Address updated successfully', address));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    await addressService.delete(userId, req.params.id as string);
    res.status(200).json(ApiResponse.success('Address deleted successfully', null));
  }),

  setDefault: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const address = await addressService.setDefault(userId, req.params.id as string);
    res.status(200).json(ApiResponse.success('Default address updated', address));
  }),
};
