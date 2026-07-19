import { prisma } from '../../shared/config/database.config';
import { ApiError } from '../../shared/utils/ApiError';
import { ICreateAddressDTO, IUpdateAddressDTO } from './address.interface';

export const addressService = {
  list: async (userId: string) => {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  },

  create: async (userId: string, dto: ICreateAddressDTO) => {
    // If this is the first address OR marked as default, clear existing defaults
    const count = await prisma.address.count({ where: { userId } });
    const shouldBeDefault = dto.isDefault || count === 0;

    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
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
  },

  update: async (userId: string, addressId: string, dto: IUpdateAddressDTO) => {
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) throw ApiError.notFound('Address not found');
    if (address.userId !== userId) throw ApiError.forbidden('You can only update your own addresses');

    // If setting as default, clear other defaults
    if (dto.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, NOT: { id: addressId } },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data: dto,
    });
  },

  delete: async (userId: string, addressId: string) => {
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) throw ApiError.notFound('Address not found');
    if (address.userId !== userId) throw ApiError.forbidden('You can only delete your own addresses');

    await prisma.address.delete({ where: { id: addressId } });

    // If deleted address was default, promote the most recent one
    if (address.isDefault) {
      const nextDefault = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (nextDefault) {
        await prisma.address.update({
          where: { id: nextDefault.id },
          data: { isDefault: true },
        });
      }
    }
  },

  setDefault: async (userId: string, addressId: string) => {
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) throw ApiError.notFound('Address not found');
    if (address.userId !== userId) throw ApiError.forbidden('You can only update your own addresses');

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      }),
    ]);

    return prisma.address.findUnique({ where: { id: addressId } });
  },
};
