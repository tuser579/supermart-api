import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { cartService } from './cart.service';

export const cartController = {
  getCart: asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.getCart(req.user!.userId);
    res.status(200).json(ApiResponse.success('Cart retrieved', cart));
  }),

  addItem: asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.addItem(req.user!.userId, req.body);
    res.status(200).json(ApiResponse.success('Item added to cart', cart));
  }),

  updateItem: asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.updateItem(req.user!.userId, req.params.itemId as string, req.body);
    res.status(200).json(ApiResponse.success('Cart item updated', cart));
  }),

  removeItem: asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.removeItem(req.user!.userId, req.params.itemId as string);
    res.status(200).json(ApiResponse.success('Item removed from cart', cart));
  }),

  clearCart: asyncHandler(async (req: Request, res: Response) => {
    await cartService.clearCart(req.user!.userId);
    res.status(200).json(ApiResponse.success('Cart cleared', null));
  }),
};
