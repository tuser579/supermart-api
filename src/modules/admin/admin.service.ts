import { prisma } from '../../shared/config/database.config';
import { ApiError } from '../../shared/utils/ApiError';
import { orderService } from '../order/order.service';
import { productService } from '../product/product.service';

export const adminService = {
  getDashboardStats: async () => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));

    const [
      totalUsers,
      activeUsers,
      newUsersToday,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      revenueResult,
      totalProducts,
      outOfStockProducts,
      totalStaff,
      availableStaff,
    ] = await prisma.$transaction([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: 'USER', isActive: true } }),
      prisma.user.count({ where: { role: 'USER', createdAt: { gte: todayStart } } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
      prisma.order.aggregate({ where: { status: 'DELIVERED' }, _sum: { totalAmount: true } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true, stock: 0 } }),
      prisma.staff.count(),
      prisma.staff.count({ where: { isAvailable: true } }),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday: newUsersToday,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        revenue: revenueResult._sum.totalAmount || 0,
      },
      products: {
        total: totalProducts,
        outOfStock: outOfStockProducts,
      },
      staff: {
        total: totalStaff,
        available: availableStaff,
      },
    };
  },

  getSalesReport: async (period: 'daily' | 'weekly' | 'monthly' = 'daily', days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        createdAt: { gte: startDate },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const grouped: Record<string, { orders: number; revenue: number }> = {};
    for (const order of orders) {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!grouped[date]) grouped[date] = { orders: 0, revenue: 0 };
      grouped[date].orders++;
      grouped[date].revenue += order.totalAmount;
    }

    return Object.entries(grouped).map(([date, data]) => ({ date, ...data }));
  },

  getTopProducts: async (limit = 10) => {
    const topItems = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: { orderId: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const productIds = topItems.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, images: true, category: true, rating: true },
    });

    return topItems.map((item) => ({
      product: products.find((p) => p.id === item.productId),
      totalSold: item._sum.quantity || 0,
      totalOrders: item._count.orderId,
    }));
  },

  getAllUsers: async (params: any) => {
    const { page = 1, limit = 20, search, role } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          profileImage: true,
          isVerified: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    const formattedUsers = users.map((u) => ({
      ...u,
      avatar: u.profileImage,
    }));

    return { users: formattedUsers, total, page, limit };
  },

  toggleUserStatus: async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound('User not found');

    return prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: { id: true, name: true, email: true, isActive: true },
    });
  },

  getStaffPerformance: async () => {
    const staff = await prisma.staff.findMany({
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { deliveries: true, attendance: true } },
      },
      orderBy: { totalDeliveries: 'desc' },
    });

    return staff.map((s) => ({
      id: s.id,
      staffId: s.staffId,
      name: s.user.name,
      email: s.user.email,
      position: s.position,
      rating: s.rating,
      totalDeliveries: s.totalDeliveries,
      earnings: s.earnings,
      isAvailable: s.isAvailable,
    }));
  },

  getQuickOptions: async () => {
    const [
      assignedOrdersCount,
      unassignedOrdersCount,
      cancellableOrdersCount,
      totalCancelledCount,
      availableStaffCount,
      recentAssignedOrders,
      recentCancelledOrders,
      staffMembers,
      outOfStockCount,
      lowStockCount,
      outOfStockProducts,
      lowStockProducts,
    ] = await prisma.$transaction([
      prisma.order.count({ where: { assignedStaffId: { not: null } } }),
      prisma.order.count({ where: { assignedStaffId: null, status: { in: ['PENDING', 'CONFIRMED'] } } }),
      prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'] } } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
      prisma.staff.count({ where: { isAvailable: true } }),
      prisma.order.findMany({
        where: { assignedStaffId: { not: null } },
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          orderId: true,
          status: true,
          totalAmount: true,
          assignedStaff: { select: { id: true, staffId: true, position: true, user: { select: { name: true, phone: true } } } },
          user: { select: { name: true, phone: true } },
          updatedAt: true,
        },
      }),
      prisma.order.findMany({
        where: { status: 'CANCELLED' },
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          orderId: true,
          totalAmount: true,
          cancellationReason: true,
          user: { select: { name: true, email: true } },
          updatedAt: true,
        },
      }),
      prisma.staff.findMany({
        select: {
          id: true,
          staffId: true,
          isAvailable: true,
          user: { select: { name: true } },
          _count: { select: { deliveries: { where: { status: { notIn: ['DELIVERED', 'CANCELLED', 'RETURNED'] } } } } },
        },
      }),
      prisma.product.count({ where: { isActive: true, stock: 0 } }),
      prisma.product.count({ where: { isActive: true, stock: { gt: 0, lte: 10 } } }),
      prisma.product.findMany({
        where: { isActive: true, stock: 0 },
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, name: true, price: true, category: true, stock: true, images: true, updatedAt: true },
      }),
      prisma.product.findMany({
        where: { isActive: true, stock: { gt: 0, lte: 10 } },
        take: 5,
        orderBy: { stock: 'asc' },
        select: { id: true, name: true, price: true, category: true, stock: true, images: true, updatedAt: true },
      }),
    ]);

    return {
      assignedOrdersOptions: {
        totalAssignedOrders: assignedOrdersCount,
        unassignedPendingOrders: unassignedOrdersCount,
        availableDeliveryStaff: availableStaffCount,
        recentAssignedOrders,
        staffWorkloadSummary: staffMembers.map((s) => ({
          staffId: s.id,
          code: s.staffId,
          name: s.user.name,
          isAvailable: s.isAvailable,
          activeAssignedCount: s._count.deliveries,
        })),
      },
      orderCancelOptions: {
        cancellableOrdersCount,
        totalCancelledCount,
        recentCancelledOrders,
        quickCancelEligibleStatuses: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'],
      },
      outOfStockOptions: {
        totalOutOfStock: outOfStockCount,
        totalLowStock: lowStockCount,
        recentOutOfStockProducts: outOfStockProducts,
        recentLowStockProducts: lowStockProducts,
      },
      quickActions: [
        { action: 'ASSIGN_STAFF', method: 'POST', endpoint: '/api/v1/orders/:id/assign' },
        { action: 'VIEW_ASSIGNED_ORDERS', method: 'GET', endpoint: '/api/v1/admin/orders/assigned' },
        { action: 'CANCEL_ORDER', method: 'POST', endpoint: '/api/v1/admin/orders/:id/cancel' },
        { action: 'VIEW_OUT_OF_STOCK', method: 'GET', endpoint: '/api/v1/admin/products/out-of-stock' },
        { action: 'RESTOCK_PRODUCT', method: 'PATCH', endpoint: '/api/v1/admin/products/:id/restock' },
        { action: 'LIST_PRODUCTS', method: 'GET', endpoint: '/api/v1/admin/products' },
        { action: 'CREATE_PRODUCT', method: 'POST', endpoint: '/api/v1/admin/products' },
        { action: 'EDIT_PRODUCT', method: 'PUT', endpoint: '/api/v1/admin/products/:id' },
        { action: 'DELETE_PRODUCT', method: 'DELETE', endpoint: '/api/v1/admin/products/:id' },
      ],
    };
  },

  getAssignedOrders: async (params: any = {}) => {
    const { page = 1, limit = 20, staffId } = params;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { assignedStaffId: staffId ? staffId : { not: null } };

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { updatedAt: 'desc' },
        include: {
          assignedStaff: {
            include: { user: { select: { name: true, phone: true, email: true } } },
          },
          user: { select: { id: true, name: true, email: true, phone: true } },
          items: {
            include: { product: { select: { id: true, name: true, images: true } } },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page: Number(page), limit: Number(limit) };
  },

  cancelOrderAsAdmin: async (orderId: string, adminId: string, reason?: string) => {
    return orderService.cancelOrder(orderId, adminId, 'ADMIN', reason);
  },

  getOutOfStockProducts: async (params: any = {}) => {
    const { page = 1, limit = 20, status = 'all' } = params;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isActive: true };
    if (status === 'out_of_stock') {
      where.stock = 0;
    } else if (status === 'low_stock') {
      where.stock = { gt: 0, lte: 10 };
    } else {
      where.stock = { lte: 10 };
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { stock: 'asc' },
        select: {
          id: true,
          name: true,
          price: true,
          discountPrice: true,
          category: true,
          brand: true,
          stock: true,
          images: true,
          updatedAt: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page: Number(page), limit: Number(limit) };
  },

  restockProduct: async (productId: string, stock?: number, addStock?: number) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw ApiError.notFound('Product not found');

    let newStock = product.stock;
    if (stock !== undefined) {
      newStock = stock;
    } else if (addStock !== undefined) {
      newStock = product.stock + addStock;
    }

    return prisma.product.update({
      where: { id: productId },
      data: { stock: Math.max(0, newStock) },
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        stock: true,
        updatedAt: true,
      },
    });
  },

  getAllProductsForAdmin: async (params: any = {}) => {
    return productService.getAllProducts({ ...params, includeInactive: true });
  },

  createProductAsAdmin: async (dto: any, adminId: string) => {
    return productService.createProduct(dto, adminId);
  },

  updateProductAsAdmin: async (productId: string, dto: any) => {
    return productService.updateProduct(productId, dto);
  },

  deleteProductAsAdmin: async (productId: string) => {
    return productService.deleteProduct(productId);
  },
};

