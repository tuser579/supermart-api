import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { orderService } from './order.service';

export const orderController = {
  createOrder: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.createOrder(req.user!.userId, req.body);
    res.status(201).json(ApiResponse.created('Order placed successfully', order));
  }),

  getOrders: asyncHandler(async (req: Request, res: Response) => {
    const { orders, total, page, limit } = await orderService.getOrders(
      req.user!.userId,
      req.user!.role,
      req.query as any
    );
    res.status(200).json(ApiResponse.paginated('Orders retrieved', orders, page, limit, total));
  }),

  getOrderById: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.getOrderById(
      req.params.id as string,
      req.user!.userId,
      req.user!.role
    );
    res.status(200).json(ApiResponse.success('Order retrieved', order));
  }),

  updateOrderStatus: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.updateOrderStatus(
      req.params.id as string,
      req.body,
      req.user!.userId,
      req.user!.role
    );
    res.status(200).json(ApiResponse.success('Order status updated', order));
  }),

  assignDelivery: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.assignDelivery(req.params.id as string, req.body.staffId);
    res.status(200).json(ApiResponse.success('Delivery assigned successfully', order));
  }),

  cancelOrder: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.cancelOrder(
      req.params.id as string,
      req.user!.userId,
      req.user!.role,
      req.body.reason
    );
    res.status(200).json(ApiResponse.success('Order cancelled successfully', order));
  }),

  returnOrder: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.returnOrder(
      req.params.id as string,
      req.user!.userId,
      req.body
    );
    res.status(200).json(ApiResponse.success('Return request submitted successfully', order));
  }),

  payOrder: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.payOrder(
      req.params.id as string,
      req.user!.userId,
      req.user!.role,
      req.body
    );
    res.status(200).json(ApiResponse.success('Payment recorded successfully', order));
  }),

  acceptOrder: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.acceptOrder(
      req.params.id as string,
      req.user!.userId
    );
    res.status(200).json(ApiResponse.success('Order accepted successfully', order));
  }),

  verifyPayment: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.verifyPayment(
      req.params.id as string,
      req.body
    );
    res.status(200).json(ApiResponse.success('Payment verification processed successfully', order));
  }),
};

