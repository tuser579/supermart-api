"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const database_config_1 = require("../../shared/config/database.config");
const ApiError_1 = require("../../shared/utils/ApiError");
const notification_service_1 = require("../notification/notification.service");
const generateOrderId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `SM-${timestamp}-${random}`;
};
const DELIVERY_CHARGE = 60; // BDT
exports.orderService = {
    createOrder: async (userId, dto) => {
        let cart = await database_config_1.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });
        let orderItems = [];
        if (cart && cart.items.length > 0) {
            // Use existing server cart
            orderItems = cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                product: item.product,
            }));
        }
        else if (dto.items && dto.items.length > 0) {
            // Cart empty but payload items supplied — resolve each product from DB directly
            for (const itemDto of dto.items) {
                const product = await database_config_1.prisma.product.findUnique({ where: { id: itemDto.productId } });
                if (product) {
                    orderItems.push({
                        productId: itemDto.productId,
                        quantity: itemDto.quantity,
                        price: product.discountPrice ?? product.price,
                        product: { name: product.name, isActive: product.isActive, stock: product.stock },
                    });
                }
            }
        }
        if (orderItems.length === 0) {
            throw ApiError_1.ApiError.badRequest('Cart is empty. Add items before placing an order.');
        }
        // Validate stock for all items
        for (const item of orderItems) {
            if (!item.product.isActive) {
                throw ApiError_1.ApiError.badRequest(`Product "${item.product.name}" is no longer available`);
            }
            if (item.product.stock < item.quantity) {
                throw ApiError_1.ApiError.badRequest(`Insufficient stock for "${item.product.name}". Available: ${item.product.stock}`);
            }
        }
        const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const totalAmount = subtotal + DELIVERY_CHARGE;
        // Create order
        const newOrder = await database_config_1.prisma.order.create({
            data: {
                orderId: generateOrderId(),
                userId,
                totalAmount,
                deliveryCharge: DELIVERY_CHARGE,
                deliveryAddress: dto.deliveryAddress,
                notes: dto.notes,
                paymentMethod: dto.paymentMethod,
                paymentStatus: (dto.paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED'),
                transactionId: dto.transactionId,
                items: {
                    create: orderItems.map((item) => ({
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
        for (const item of orderItems) {
            try {
                await database_config_1.prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
            catch (e) { }
        }
        // Clear cart if it existed
        if (cart) {
            try {
                await database_config_1.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
                await database_config_1.prisma.cart.update({ where: { id: cart.id }, data: { totalAmount: 0 } });
            }
            catch (e) { }
        }
        // Send notification
        await notification_service_1.notificationService.create({
            userId,
            title: 'Order Placed Successfully! 🛒',
            message: `Your order ${newOrder.orderId} has been placed and is being confirmed.`,
            type: 'ORDER',
            data: { orderId: newOrder.id, orderRefId: newOrder.orderId },
        });
        return newOrder;
    },
    getOrders: async (userId, role, params) => {
        const { page = 1, limit = 20, status } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (role !== 'ADMIN')
            where.userId = userId; // Users only see their own orders
        const [orders, total] = await database_config_1.prisma.$transaction([
            database_config_1.prisma.order.findMany({
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
            database_config_1.prisma.order.count({ where }),
        ]);
        return { orders, total, page, limit };
    },
    getOrderById: async (orderId, userId, role) => {
        const order = await database_config_1.prisma.order.findUnique({
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
        if (!order)
            throw ApiError_1.ApiError.notFound('Order not found');
        if (role === 'USER' && order.userId !== userId) {
            throw ApiError_1.ApiError.forbidden('Access denied to this order');
        }
        return order;
    },
    updateOrderStatus: async (orderId, dto, userId, role) => {
        const order = await database_config_1.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw ApiError_1.ApiError.notFound('Order not found');
        // Staff can only update their assigned orders
        if (role === 'STAFF') {
            const staff = await database_config_1.prisma.staff.findUnique({ where: { userId } });
            if (!staff || order.assignedStaffId !== staff.id) {
                throw ApiError_1.ApiError.forbidden('You can only update orders assigned to you');
            }
        }
        // Status transition validation
        const validTransitions = {
            PENDING: ['CONFIRMED', 'CANCELLED'],
            CONFIRMED: ['PROCESSING', 'CANCELLED'],
            PROCESSING: ['SHIPPED'],
            SHIPPED: ['DELIVERED'],
            DELIVERED: ['RETURN_REQUESTED', 'RETURNED'],
            RETURN_REQUESTED: ['RETURNED', 'DELIVERED'],
            RETURNED: [],
            CANCELLED: [],
        };
        const allowed = validTransitions[order.status] || [];
        if (!allowed.includes(dto.status)) {
            throw ApiError_1.ApiError.badRequest(`Cannot transition from ${order.status} to ${dto.status}`);
        }
        const updateData = { status: dto.status };
        if (dto.status === 'DELIVERED') {
            updateData.deliveredAt = new Date();
        }
        if (dto.status === 'CANCELLED' || dto.status === 'RETURNED') {
            if (dto.status === 'CANCELLED')
                updateData.cancellationReason = dto.cancellationReason;
            if (dto.status === 'RETURNED')
                updateData.paymentStatus = 'REFUNDED';
            // Restore stock
            const orderWithItems = await database_config_1.prisma.order.findUnique({
                where: { id: orderId },
                include: { items: true },
            });
            if (orderWithItems) {
                for (const item of orderWithItems.items) {
                    await database_config_1.prisma.product.update({
                        where: { id: item.productId },
                        data: { stock: { increment: item.quantity } },
                    });
                }
            }
        }
        const updatedOrder = await database_config_1.prisma.order.update({ where: { id: orderId }, data: updateData });
        // Notify user
        await notification_service_1.notificationService.create({
            userId: order.userId,
            title: `Order Status Updated`,
            message: `Your order ${order.orderId} is now ${dto.status}.`,
            type: 'ORDER',
            data: { orderId: order.id, status: dto.status },
        });
        return updatedOrder;
    },
    assignDelivery: async (orderId, staffId) => {
        const order = await database_config_1.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw ApiError_1.ApiError.notFound('Order not found');
        if (order.status === 'DELIVERED' || order.status === 'CANCELLED' || order.status === 'RETURNED') {
            throw ApiError_1.ApiError.badRequest('Cannot assign delivery for completed or cancelled orders');
        }
        const staff = await database_config_1.prisma.staff.findUnique({ where: { id: staffId } });
        if (!staff)
            throw ApiError_1.ApiError.notFound('Staff member not found');
        if (!staff.isAvailable)
            throw ApiError_1.ApiError.badRequest('Staff member is not available');
        const updatedOrder = await database_config_1.prisma.order.update({
            where: { id: orderId },
            data: {
                assignedStaffId: staffId,
                status: order.status === 'PENDING' ? 'CONFIRMED' : order.status,
            },
        });
        await notification_service_1.notificationService.create({
            userId: order.userId,
            title: 'Delivery Agent Assigned',
            message: `A delivery agent has been assigned to your order ${order.orderId}.`,
            type: 'ORDER',
            data: { orderId: order.id },
        });
        return updatedOrder;
    },
    cancelOrder: async (orderId, userId, reason) => {
        const order = await database_config_1.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw ApiError_1.ApiError.notFound('Order not found');
        if (order.userId !== userId)
            throw ApiError_1.ApiError.forbidden('Access denied');
        if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
            throw ApiError_1.ApiError.badRequest('Order cannot be cancelled at this stage');
        }
        const updatedOrder = await database_config_1.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED', cancellationReason: reason },
        });
        // Restore stock
        try {
            const items = await database_config_1.prisma.orderItem.findMany({ where: { orderId } });
            for (const item of items) {
                await database_config_1.prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } },
                });
            }
        }
        catch (e) { }
        return updatedOrder;
    },
    returnOrder: async (orderId, userId, dto) => {
        const order = await database_config_1.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw ApiError_1.ApiError.notFound('Order not found');
        if (order.userId !== userId)
            throw ApiError_1.ApiError.forbidden('Access denied');
        if (order.status !== 'DELIVERED') {
            throw ApiError_1.ApiError.badRequest('Order must be delivered before initiating a return request');
        }
        const updatedOrder = await database_config_1.prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'RETURN_REQUESTED',
                returnReason: dto.reason,
                returnDetails: dto.details,
                returnImages: dto.images || [],
            },
        });
        await notification_service_1.notificationService.create({
            userId,
            title: 'Return Request Submitted 📦',
            message: `Your return request for order ${order.orderId} has been submitted and is under review.`,
            type: 'ORDER',
            data: { orderId: order.id, status: 'RETURN_REQUESTED' },
        });
        return updatedOrder;
    },
    payOrder: async (orderId, userId, dto) => {
        const order = await database_config_1.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw ApiError_1.ApiError.notFound('Order not found');
        if (order.userId !== userId)
            throw ApiError_1.ApiError.forbidden('Access denied');
        if (order.status !== 'DELIVERED') {
            throw ApiError_1.ApiError.badRequest('Payment can only be submitted after the order has been delivered');
        }
        if (order.paymentStatus === 'COMPLETED') {
            throw ApiError_1.ApiError.badRequest('Payment for this order has already been completed');
        }
        const updatedOrder = await database_config_1.prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: 'COMPLETED',
                paymentMethod: dto.paymentMethod,
                transactionId: dto.transactionId || order.transactionId,
            },
        });
        await notification_service_1.notificationService.create({
            userId,
            title: 'Payment Received 💳',
            message: `Payment of ৳${order.totalAmount} for order ${order.orderId} was successfully recorded.`,
            type: 'ORDER',
            data: { orderId: order.id, paymentStatus: 'COMPLETED' },
        });
        return updatedOrder;
    },
};
//# sourceMappingURL=order.service.js.map