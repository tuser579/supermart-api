import { Request, Response, NextFunction } from 'express';
import * as wishlistService from './wishlist.service';

export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const wishlist = await wishlistService.getWishlist(userId);
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const item = await wishlistService.addToWishlist(userId, productId);
    res.status(201).json({ success: true, data: item, message: 'Added to wishlist' });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { productId } = req.params;

    await wishlistService.removeFromWishlist(userId, productId);
    res.status(200).json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
};
