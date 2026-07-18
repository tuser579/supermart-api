import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { productService } from './product.service';

export const productController = {
  createProduct: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.createProduct(req.body, req.user!.userId);
    res.status(201).json(ApiResponse.created('Product created successfully', product));
  }),

  getAllProducts: asyncHandler(async (req: Request, res: Response) => {
    const { products, total, page, limit } = await productService.getAllProducts(req.query as any);
    res.status(200).json(
      ApiResponse.paginated('Products retrieved', products, page, limit, total)
    );
  }),

  getProductById: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.getProductById(req.params.id as string);
    res.status(200).json(ApiResponse.success('Product retrieved', product));
  }),

  updateProduct: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.updateProduct(req.params.id as string, req.body);
    res.status(200).json(ApiResponse.success('Product updated successfully', product));
  }),

  deleteProduct: asyncHandler(async (req: Request, res: Response) => {
    await productService.deleteProduct(req.params.id as string);
    res.status(200).json(ApiResponse.success('Product deleted successfully', null));
  }),

  getCategories: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await productService.getCategories();
    res.status(200).json(ApiResponse.success('Categories retrieved', categories));
  }),
};
