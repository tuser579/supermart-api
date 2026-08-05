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

  getQuickOptions: asyncHandler(async (_req: Request, res: Response) => {
    const options = await adminService.getQuickOptions();
    res.status(200).json(ApiResponse.success('Admin quick options retrieved successfully', options));
  }),

  getAssignedOrders: asyncHandler(async (req: Request, res: Response) => {
    const { orders, total, page, limit } = await adminService.getAssignedOrders(req.query);
    res.status(200).json(ApiResponse.paginated('Assigned orders retrieved successfully', orders, page, limit, total));
  }),

  cancelOrder: asyncHandler(async (req: Request, res: Response) => {
    const order = await adminService.cancelOrderAsAdmin(
      req.params.id as string,
      req.user!.userId,
      req.body.reason
    );
    res.status(200).json(ApiResponse.success('Order cancelled by admin successfully', order));
  }),

  getOutOfStockProducts: asyncHandler(async (req: Request, res: Response) => {
    const { products, total, page, limit } = await adminService.getOutOfStockProducts(req.query);
    res.status(200).json(ApiResponse.paginated('Out of stock products retrieved successfully', products, page, limit, total));
  }),

  restockProduct: asyncHandler(async (req: Request, res: Response) => {
    const { stock, addStock } = req.body;
    const product = await adminService.restockProduct(req.params.id as string, stock, addStock);
    res.status(200).json(ApiResponse.success('Product restocked successfully', product));
  }),

  getAllProducts: asyncHandler(async (req: Request, res: Response) => {
    const { products, total, page, limit } = await adminService.getAllProductsForAdmin(req.query);
    res.status(200).json(ApiResponse.paginated('Admin products retrieved successfully', products, page, limit, total));
  }),

  createProduct: asyncHandler(async (req: Request, res: Response) => {
    const product = await adminService.createProductAsAdmin(req.body, req.user!.userId);
    res.status(201).json(ApiResponse.created('Product created successfully in database', product));
  }),

  updateProduct: asyncHandler(async (req: Request, res: Response) => {
    const product = await adminService.updateProductAsAdmin(req.params.id as string, req.body);
    res.status(200).json(ApiResponse.success('Product updated successfully in database', product));
  }),

  updateProductImages: asyncHandler(async (req: Request, res: Response) => {
    const images = req.body.images || req.body.image || req.body.imageUrl;
    const product = await adminService.updateProductImages(req.params.id as string, images);
    res.status(200).json(ApiResponse.success('Product images updated successfully by admin', product));
  }),

  deleteProduct: asyncHandler(async (req: Request, res: Response) => {
    await adminService.deleteProductAsAdmin(req.params.id as string);
    res.status(200).json(
      ApiResponse.success('Product deleted successfully from database', {
        success: true,
        message: 'Product deleted',
      })
    );
  }),
};