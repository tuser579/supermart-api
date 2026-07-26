import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSavedPaymentMethods = async (userId: string) => {
  return prisma.savedPaymentMethod.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const addSavedPaymentMethod = async (data: {
  userId: string;
  type: string;
  provider: string;
  last4?: string;
  isDefault?: boolean;
}) => {
  if (data.isDefault) {
    // Unset other defaults
    await prisma.savedPaymentMethod.updateMany({
      where: { userId: data.userId },
      data: { isDefault: false },
    });
  }

  return prisma.savedPaymentMethod.create({
    data,
  });
};

export const deleteSavedPaymentMethod = async (userId: string, id: string) => {
  return prisma.savedPaymentMethod.delete({
    where: {
      id,
      userId, // Ensure the method belongs to the user
    },
  });
};
