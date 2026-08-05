import { prisma } from '../../shared/config/database.config';
import { ApiError } from '../../shared/utils/ApiError';
import { ICreateProductDTO, IUpdateProductDTO, IProductQueryParams } from './product.interface';

export const productService = {
  formatProduct: (product: any) => {
    if (!product) return null;
    const { ratingCount, ...rest } = product;
    return {
      ...rest,
      numReviews: ratingCount ?? product.numReviews ?? 0,
    };
  },

  formatProductDetail: (product: any) => {
    if (!product) return null;
    const { ratingCount, reviews, ...rest } = product;
    const formattedReviews = (reviews || []).map((rev: any) => ({
      id: rev.id,
      userName: rev.user?.name || rev.userName || 'Anonymous',
      rating: rev.rating,
      comment: rev.comment,
      createdAt: rev.createdAt,
    }));
    return {
      ...rest,
      numReviews: ratingCount ?? 0,
      reviews: formattedReviews,
    };
  },

  createProduct: async (dto: ICreateProductDTO, createdBy: string) => {
    const product = await prisma.product.create({
      data: { ...dto, createdBy },
    });
    return productService.formatProduct(product);
  },

  getAllProducts: async (params: IProductQueryParams) => {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      inStock,
      outOfStock,
      lowStock,
      includeInactive,
    } = params;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const where: any = {};
    if (includeInactive === 'true' || (includeInactive as any) === true) {
      // Include both active and inactive products
    } else {
      where.isActive = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = { equals: category, mode: 'insensitive' };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = Number(minPrice);
      if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
    }
    if (outOfStock === 'true' || (outOfStock as any) === true) {
      where.stock = 0;
    } else if (lowStock === 'true' || (lowStock as any) === true) {
      where.stock = { gt: 0, lte: 10 };
    } else if (inStock !== undefined) {
      where.stock = inStock ? { gt: 0 } : { equals: 0 };
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          discountPrice: true,
          category: true,
          brand: true,
          stock: true,
          images: true,
          rating: true,
          ratingCount: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map((p) => productService.formatProduct(p));

    return { products: formattedProducts, total, page: pageNum, limit: limitNum };
  },

  getProductById: async (id: string) => {
    const product = await prisma.product.findUnique({
      where: { id, isActive: true },
      include: {
        reviews: {
          include: {
            user: { select: { id: true, name: true, profileImage: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) throw ApiError.notFound('Product not found');
    return productService.formatProductDetail(product);
  },

  updateProduct: async (id: string, dto: IUpdateProductDTO & { image?: string; imageUrl?: string }) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw ApiError.notFound('Product not found');

    const updateData: any = { ...dto };

    const singleImage = updateData.image || updateData.imageUrl;
    if (singleImage) {
      if (Array.isArray(updateData.images) && updateData.images.length > 0) {
        if (!updateData.images.includes(singleImage)) {
          updateData.images.unshift(singleImage);
        }
      } else {
        updateData.images = [singleImage];
      }
      delete updateData.image;
      delete updateData.imageUrl;
    }

    const updated = await prisma.product.update({ where: { id }, data: updateData });
    return productService.formatProduct(updated);
  },

  deleteProduct: async (id: string) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw ApiError.notFound('Product not found');

    // Clean up product from all users' carts and wishlists
    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.wishlist.deleteMany({ where: { productId: id } });

    // Check if product exists in any order
    const orderCount = await prisma.orderItem.count({ where: { productId: id } });

    if (orderCount === 0) {
      // Product is not in any order -> permanently delete from database
      await prisma.review.deleteMany({ where: { productId: id } });
      await prisma.product.delete({ where: { id } });
    } else {
      // Product is in existing order(s) -> deactivate (soft delete) to maintain order integrity
      await prisma.product.update({ where: { id }, data: { isActive: false } });
    }
  },

  updateStock: async (id: string, quantity: number): Promise<void> => {
    const product = await prisma.product.findUnique({ where: { id }, select: { stock: true } });
    if (!product) throw ApiError.notFound('Product not found');

    const newStock = product.stock + quantity;
    if (newStock < 0) throw ApiError.badRequest('Insufficient stock');

    await prisma.product.update({ where: { id }, data: { stock: newStock } });
  },

  getCategories: async (): Promise<string[]> => {
    const result = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });
    return result.map((r) => r.category).sort();
  },
};
