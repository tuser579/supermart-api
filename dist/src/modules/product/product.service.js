"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const database_config_1 = require("../../shared/config/database.config");
const ApiError_1 = require("../../shared/utils/ApiError");
exports.productService = {
    createProduct: async (dto, createdBy) => {
        const product = await database_config_1.prisma.product.create({
            data: { ...dto, createdBy },
        });
        return product;
    },
    getAllProducts: async (params) => {
        const { page = 1, limit = 20, search, category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', inStock, } = params;
        const skip = (page - 1) * limit;
        // Build filter
        const where = { isActive: true };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { brand: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (category)
            where.category = { equals: category, mode: 'insensitive' };
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        if (inStock !== undefined) {
            where.stock = inStock ? { gt: 0 } : { equals: 0 };
        }
        const [products, total] = await database_config_1.prisma.$transaction([
            database_config_1.prisma.product.findMany({
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
            database_config_1.prisma.product.count({ where }),
        ]);
        return { products, total, page, limit };
    },
    getProductById: async (id) => {
        const product = await database_config_1.prisma.product.findUnique({
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
        if (!product)
            throw ApiError_1.ApiError.notFound('Product not found');
        return product;
    },
    updateProduct: async (id, dto) => {
        const product = await database_config_1.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw ApiError_1.ApiError.notFound('Product not found');
        return database_config_1.prisma.product.update({ where: { id }, data: dto });
    },
    deleteProduct: async (id) => {
        const product = await database_config_1.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw ApiError_1.ApiError.notFound('Product not found');
        // Soft delete
        await database_config_1.prisma.product.update({ where: { id }, data: { isActive: false } });
    },
    updateStock: async (id, quantity) => {
        const product = await database_config_1.prisma.product.findUnique({ where: { id }, select: { stock: true } });
        if (!product)
            throw ApiError_1.ApiError.notFound('Product not found');
        const newStock = product.stock + quantity;
        if (newStock < 0)
            throw ApiError_1.ApiError.badRequest('Insufficient stock');
        await database_config_1.prisma.product.update({ where: { id }, data: { stock: newStock } });
    },
    getCategories: async () => {
        const result = await database_config_1.prisma.product.findMany({
            where: { isActive: true },
            select: { category: true },
            distinct: ['category'],
        });
        return result.map((r) => r.category).sort();
    },
};
//# sourceMappingURL=product.service.js.map