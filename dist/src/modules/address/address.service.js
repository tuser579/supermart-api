"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressService = void 0;
const database_config_1 = require("../../shared/config/database.config");
const ApiError_1 = require("../../shared/utils/ApiError");
exports.addressService = {
    list: async (userId) => {
        return database_config_1.prisma.address.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
    },
    create: async (userId, dto) => {
        return database_config_1.prisma.$transaction(async (tx) => {
            // If this is the first address OR marked as default, clear existing defaults
            const count = await tx.address.count({ where: { userId } });
            const shouldBeDefault = dto.isDefault || count === 0;
            if (shouldBeDefault) {
                await tx.address.updateMany({
                    where: { userId, isDefault: true },
                    data: { isDefault: false },
                });
            }
            return tx.address.create({
                data: {
                    userId,
                    label: dto.label,
                    fullName: dto.fullName,
                    phone: dto.phone,
                    addressLine1: dto.addressLine1,
                    addressLine2: dto.addressLine2,
                    city: dto.city,
                    area: dto.area,
                    postalCode: dto.postalCode,
                    isDefault: shouldBeDefault,
                },
            });
        });
    },
    update: async (userId, addressId, dto) => {
        const address = await database_config_1.prisma.address.findUnique({ where: { id: addressId } });
        if (!address)
            throw ApiError_1.ApiError.notFound('Address not found');
        if (address.userId !== userId)
            throw ApiError_1.ApiError.forbidden('You can only update your own addresses');
        // If setting as default, clear other defaults
        if (dto.isDefault) {
            await database_config_1.prisma.address.updateMany({
                where: { userId, isDefault: true, NOT: { id: addressId } },
                data: { isDefault: false },
            });
        }
        return database_config_1.prisma.address.update({
            where: { id: addressId },
            data: dto,
        });
    },
    delete: async (userId, addressId) => {
        const address = await database_config_1.prisma.address.findUnique({ where: { id: addressId } });
        if (!address)
            throw ApiError_1.ApiError.notFound('Address not found');
        if (address.userId !== userId)
            throw ApiError_1.ApiError.forbidden('You can only delete your own addresses');
        await database_config_1.prisma.address.delete({ where: { id: addressId } });
        // If deleted address was default, promote the most recent one
        if (address.isDefault) {
            const nextDefault = await database_config_1.prisma.address.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });
            if (nextDefault) {
                await database_config_1.prisma.address.update({
                    where: { id: nextDefault.id },
                    data: { isDefault: true },
                });
            }
        }
    },
    setDefault: async (userId, addressId) => {
        const address = await database_config_1.prisma.address.findUnique({ where: { id: addressId } });
        if (!address)
            throw ApiError_1.ApiError.notFound('Address not found');
        if (address.userId !== userId)
            throw ApiError_1.ApiError.forbidden('You can only update your own addresses');
        await database_config_1.prisma.$transaction([
            database_config_1.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            }),
            database_config_1.prisma.address.update({
                where: { id: addressId },
                data: { isDefault: true },
            }),
        ]);
        return database_config_1.prisma.address.findUnique({ where: { id: addressId } });
    },
};
//# sourceMappingURL=address.service.js.map