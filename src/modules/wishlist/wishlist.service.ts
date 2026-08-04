import { prisma } from '../../shared/config/database.config';
import { ApiError } from '../../shared/utils/ApiError';

export const getWishlist = async (userId: string) => {
  return prisma.wishlist.findMany({
    where: { userId },
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
          rating: true,
          category: {
            select: { id: true, name: true }
          }
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const addToWishlist = async (userId: string, productId: string) => {
  // 1. Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  // 2. Check if already in wishlist to avoid unique constraint error
  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    include: {
      product: true,
    },
  });

  if (existing) {
    return existing;
  }

  // 3. Create wishlist entry
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
  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!existing) {
    throw ApiError.notFound('Item not found in wishlist');
  }

  return prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};
