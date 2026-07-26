import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWishlist = async (userId: string) => {
  return prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const addToWishlist = async (userId: string, productId: string) => {
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

export const removeFromWishlist = async (userId: string, productId: string) => {
  return prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};
