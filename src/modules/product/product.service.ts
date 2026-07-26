import { prisma } from '../../shared/config/database.config';
import { ApiError } from '../../shared/utils/ApiError';
import { ICreateProductDTO, IUpdateProductDTO, IProductQueryParams } from './product.interface';

export const productService = {
  createProduct: async (dto: ICreateProductDTO, createdBy: string) => {
    const product = await prisma.product.create({
      data: { ...dto, createdBy },
    });
    return product;
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

    const skip = (page - 1) * limit;

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
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
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
        take: limit,
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

    return { products, total, page, limit };
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
    return product;
  },

  updateProduct: async (id: string, dto: IUpdateProductDTO) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw ApiError.notFound('Product not found');

    return prisma.product.update({ where: { id }, data: dto });
  },

  deleteProduct: async (id: string) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw ApiError.notFound('Product not found');

    // Soft delete
    await prisma.product.update({ where: { id }, data: { isActive: false } });
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
