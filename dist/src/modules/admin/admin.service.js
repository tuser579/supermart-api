"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const database_config_1 = require("../../shared/config/database.config");
const ApiError_1 = require("../../shared/utils/ApiError");
exports.adminService = {
    getDashboardStats: async () => {
        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const [totalUsers, activeUsers, newUsersToday, totalOrders, pendingOrders, deliveredOrders, cancelledOrders, revenueResult, totalProducts, outOfStockProducts, totalStaff, availableStaff,] = await database_config_1.prisma.$transaction([
            database_config_1.prisma.user.count({ where: { role: 'USER' } }),
            database_config_1.prisma.user.count({ where: { role: 'USER', isActive: true } }),
            database_config_1.prisma.user.count({ where: { role: 'USER', createdAt: { gte: todayStart } } }),
            database_config_1.prisma.order.count(),
            database_config_1.prisma.order.count({ where: { status: 'PENDING' } }),
            database_config_1.prisma.order.count({ where: { status: 'DELIVERED' } }),
            database_config_1.prisma.order.count({ where: { status: 'CANCELLED' } }),
            database_config_1.prisma.order.aggregate({ where: { status: 'DELIVERED' }, _sum: { totalAmount: true } }),
            database_config_1.prisma.product.count({ where: { isActive: true } }),
            database_config_1.prisma.product.count({ where: { isActive: true, stock: 0 } }),
            database_config_1.prisma.staff.count(),
            database_config_1.prisma.staff.count({ where: { isAvailable: true } }),
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
    getSalesReport: async (period = 'daily', days = 30) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const orders = await database_config_1.prisma.order.findMany({
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
        const grouped = {};
        for (const order of orders) {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!grouped[date])
                grouped[date] = { orders: 0, revenue: 0 };
            grouped[date].orders++;
            grouped[date].revenue += order.totalAmount;
        }
        return Object.entries(grouped).map(([date, data]) => ({ date, ...data }));
    },
    getTopProducts: async (limit = 10) => {
        const topItems = await database_config_1.prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            _count: { orderId: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: limit,
        });
        const productIds = topItems.map((item) => item.productId);
        const products = await database_config_1.prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true, price: true, images: true, category: true, rating: true },
        });
        return topItems.map((item) => ({
            product: products.find((p) => p.id === item.productId),
            totalSold: item._sum.quantity || 0,
            totalOrders: item._count.orderId,
        }));
    },
    getAllUsers: async (params) => {
        const { page = 1, limit = 20, search, role } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (role)
            where.role = role;
        const [users, total] = await database_config_1.prisma.$transaction([
            database_config_1.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    isVerified: true,
                    isActive: true,
                    lastLogin: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            database_config_1.prisma.user.count({ where }),
        ]);
        return { users, total, page, limit };
    },
    toggleUserStatus: async (userId) => {
        const user = await database_config_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw ApiError_1.ApiError.notFound('User not found');
        return database_config_1.prisma.user.update({
            where: { id: userId },
            data: { isActive: !user.isActive },
            select: { id: true, name: true, email: true, isActive: true },
        });
    },
    getStaffPerformance: async () => {
        const staff = await database_config_1.prisma.staff.findMany({
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
};
//# sourceMappingURL=admin.service.js.map