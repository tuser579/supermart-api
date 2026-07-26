"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = void 0;
const database_config_1 = require("../../shared/config/database.config");
const ApiError_1 = require("../../shared/utils/ApiError");
const cartInclude = {
    items: {
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    discountPrice: true,
                    images: true,
                    stock: true,
                    isActive: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    },
};
const recalculateCartTotal = async (cartId) => {
    const items = await database_config_1.prisma.cartItem.findMany({
        where: { cartId },
        select: { price: true, quantity: true },
    });
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await database_config_1.prisma.cart.update({ where: { id: cartId }, data: { totalAmount: total } });
    return total;
};
exports.cartService = {
    getCart: async (userId) => {
        let cart = await database_config_1.prisma.cart.findUnique({
            where: { userId },
            include: cartInclude,
        });
        // Auto-create cart if it doesn't exist
        if (!cart) {
            cart = await database_config_1.prisma.cart.create({
                data: { userId, totalAmount: 0 },
                include: cartInclude,
            });
        }
        return {
            ...cart,
            itemCount: cart.items.length,
        };
    },
    addItem: async (userId, dto) => {
        const product = await database_config_1.prisma.product.findUnique({
            where: { id: dto.productId, isActive: true },
        });
        if (!product)
            throw ApiError_1.ApiError.notFound('Product not found');
        if (product.stock < dto.quantity) {
            throw ApiError_1.ApiError.badRequest(`Only ${product.stock} units available in stock`);
        }
        // Get or create cart
        let cart = await database_config_1.prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await database_config_1.prisma.cart.create({ data: { userId, totalAmount: 0 } });
        }
        const effectivePrice = product.discountPrice ?? product.price;
        // Upsert cart item
        await database_config_1.prisma.cartItem.upsert({
            where: { cartId_productId: { cartId: cart.id, productId: dto.productId } },
            update: { quantity: { increment: dto.quantity }, price: effectivePrice },
            create: {
                cartId: cart.id,
                productId: dto.productId,
                quantity: dto.quantity,
                price: effectivePrice,
            },
        });
        await recalculateCartTotal(cart.id);
        return exports.cartService.getCart(userId);
    },
    updateItem: async (userId, itemId, dto) => {
        const cart = await database_config_1.prisma.cart.findUnique({ where: { userId } });
        if (!cart)
            throw ApiError_1.ApiError.notFound('Cart not found');
        const item = await database_config_1.prisma.cartItem.findFirst({
            where: { id: itemId, cartId: cart.id },
            include: { product: true },
        });
        if (!item)
            throw ApiError_1.ApiError.notFound('Cart item not found');
        if (dto.quantity <= 0) {
            await database_config_1.prisma.cartItem.delete({ where: { id: itemId } });
        }
        else {
            if (item.product.stock < dto.quantity) {
                throw ApiError_1.ApiError.badRequest(`Only ${item.product.stock} units available`);
            }
            await database_config_1.prisma.cartItem.update({ where: { id: itemId }, data: { quantity: dto.quantity } });
        }
        await recalculateCartTotal(cart.id);
        return exports.cartService.getCart(userId);
    },
    removeItem: async (userId, itemId) => {
        const cart = await database_config_1.prisma.cart.findUnique({ where: { userId } });
        if (!cart)
            throw ApiError_1.ApiError.notFound('Cart not found');
        const item = await database_config_1.prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
        if (!item)
            throw ApiError_1.ApiError.notFound('Cart item not found');
        await database_config_1.prisma.cartItem.delete({ where: { id: itemId } });
        await recalculateCartTotal(cart.id);
        return exports.cartService.getCart(userId);
    },
    clearCart: async (userId) => {
        const cart = await database_config_1.prisma.cart.findUnique({ where: { userId } });
        if (!cart)
            return;
        await database_config_1.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        await database_config_1.prisma.cart.update({ where: { id: cart.id }, data: { totalAmount: 0 } });
    },
};
//# sourceMappingURL=cart.service.js.map