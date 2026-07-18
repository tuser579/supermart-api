import { prisma } from '../../shared/config/database.config';
import { ApiError } from '../../shared/utils/ApiError';
import { notificationService } from '../notification/notification.service';
import {
  ICreateOrderDTO,
  IUpdateOrderStatusDTO,
  IOrderQueryParams,
} from './order.interface';

const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `SM-${timestamp}-${random}`;
};

const DELIVERY_CHARGE = 60; // BDT

export const orderService = {
  createOrder: async (userId: string, dto: ICreateOrderDTO) => {
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw ApiError.badRequest('Cart is empty. Add items before placing an order.');
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw ApiError.badRequest(`Product "${item.product.name}" is no longer available`);
      }
      if (item.product.stock < item.quantity) {
        throw ApiError.badRequest(
          `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}`
        );
      }
    }

    const subtotal = cart.totalAmount;
    const totalAmount = subtotal + DELIVERY_CHARGE;

    // Use transaction to create order and update stocks atomically
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderId: generateOrderId(),
          userId,
          totalAmount,
          deliveryCharge: DELIVERY_CHARGE,
          deliveryAddress: dto.deliveryAddress as any,
          notes: dto.notes,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: { include: { product: { select: { id: true, name: true, images: true } } } },
          user: { select: { id: true, name: true, email: true } },
        },
      });

      // Decrement product stocks
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.update({ where: { id: cart.id }, data: { totalAmount: 0 } });

      return newOrder;
    });

    // Send notification
    await notificationService.create({
      userId,
      title: 'Order Placed Successfully! 🛒',
      message: `Your order ${order.orderId} has been placed and is being confirmed.`,
      type: 'ORDER',
      data: { orderId: order.id, orderRefId: order.orderId },
    });

    return order;
  },

  getOrders: async (userId: string, role: string, params: IOrderQueryParams) => {
    const { page = 1, limit = 20, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (role !== 'ADMIN') where.userId = userId; // Users only see their own orders

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, images: true, price: true } },
            },
          },
          user: { select: { id: true, name: true, email: true, phone: true } },
          assignedStaff: {
            include: { user: { select: { name: true, phone: true } } },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  },

  getOrderById: async (orderId: string, userId: string, role: string) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, images: true, price: true, description: true } },
          },
        },
        user: { select: { id: true, name: true, email: true, phone: true } },
        assignedStaff: {
          include: { user: { select: { name: true, phone: true } } },
        },
      },
    });

    if (!order) throw ApiError.notFound('Order not found');
    if (role === 'USER' && order.userId !== userId) {
      throw ApiError.forbidden('Access denied to this order');
    }

    return order;
  },

  updateOrderStatus: async (
    orderId: string,
    dto: IUpdateOrderStatusDTO,
    userId: string,
    role: string
  ) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw ApiError.notFound('Order not found');

    // Staff can only update their assigned orders
    if (role === 'STAFF') {
      const staff = await prisma.staff.findUnique({ where: { userId } });
      if (!staff || order.assignedStaffId !== staff.id) {
        throw ApiError.forbidden('You can only update orders assigned to you');
      }
    }

    // Status transition validation
    const validTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['SHIPPED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: [],
      CANCELLED: [],
    };

    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(dto.status)) {
      throw ApiError.badRequest(
        `Cannot transition from ${order.status} to ${dto.status}`
      );
    }

    const updateData: any = { status: dto.status };
    if (dto.status === 'DELIVERED') updateData.deliveredAt = new Date();
    if (dto.status === 'CANCELLED') {
      updateData.cancellationReason = dto.cancellationReason;
      // Restore stock
      const orderWithItems = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (orderWithItems) {
        for (const item of orderWithItems.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    const updatedOrder = await prisma.order.update({ where: { id: orderId }, data: updateData });

    // Notify user
    await notificationService.create({
      userId: order.userId,
      title: `Order Status Updated`,
      message: `Your order ${order.orderId} is now ${dto.status}.`,
      type: 'ORDER',
      data: { orderId: order.id, status: dto.status },
    });

    return updatedOrder;
  },

  assignDelivery: async (orderId: string, staffId: string) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw ApiError.notFound('Order not found');
    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      throw ApiError.badRequest('Cannot assign delivery for completed or cancelled orders');
    }

    const staff = await prisma.staff.findUnique({ where: { id: staffId } });
    if (!staff) throw ApiError.notFound('Staff member not found');
    if (!staff.isAvailable) throw ApiError.badRequest('Staff member is not available');

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        assignedStaffId: staffId,
        status: order.status === 'PENDING' ? 'CONFIRMED' : order.status,
      },
    });

    await notificationService.create({
      userId: order.userId,
      title: 'Delivery Agent Assigned',
      message: `A delivery agent has been assigned to your order ${order.orderId}.`,
      type: 'ORDER',
      data: { orderId: order.id },
    });

    return updatedOrder;
  },

  cancelOrder: async (orderId: string, userId: string, reason?: string) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw ApiError.notFound('Order not found');
    if (order.userId !== userId) throw ApiError.forbidden('Access denied');
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw ApiError.badRequest('Order cannot be cancelled at this stage');
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED', cancellationReason: reason },
      });

      // Restore stock
      const items = await tx.orderItem.findMany({ where: { orderId } });
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return updated;
    });

    return updatedOrder;
  },
};
