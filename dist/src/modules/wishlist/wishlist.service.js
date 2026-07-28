"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getWishlist = async (userId) => {
    return prisma.wishlist.findMany({
        where: { userId },
        include: {
            product: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getWishlist = getWishlist;
const addToWishlist = async (userId, productId) => {
    // Check if it already exists to avoid unique constraint error
    const existing = await prisma.wishlist.findUnique({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
    });
    if (existing) {
        return existing;
    }
    return prisma.wishlist.create({
        data: {
            userId,
            productId,
        },
        include: {
            product: true,
        },
    });
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (userId, productId) => {
    return prisma.wishlist.delete({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
    });
};
exports.removeFromWishlist = removeFromWishlist;
//# sourceMappingURL=wishlist.service.js.map