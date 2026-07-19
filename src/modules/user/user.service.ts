import { prisma } from '../../shared/config/database.config';
import { comparePassword, hashPassword } from '../../shared/utils/hashPassword';
import { ApiError } from '../../shared/utils/ApiError';
import { IUpdateProfileDTO, IChangePasswordDTO, IUserProfile } from './user.interface';

const userSelectFields = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  profileImage: true,
  isVerified: true,
  isActive: true,
  lastLogin: true,
  createdAt: true,
};

export const userService = {
  getProfile: async (userId: string): Promise<IUserProfile> => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelectFields,
    });

    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  updateProfile: async (userId: string, dto: IUpdateProfileDTO): Promise<IUserProfile> => {
    // Check phone uniqueness if changing
    if (dto.phone) {
      const existing = await prisma.user.findFirst({
        where: { phone: dto.phone, NOT: { id: userId } },
      });
      if (existing) throw ApiError.conflict('Phone number is already in use');
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: dto,
      select: userSelectFields,
    });

    return user;
  },

  changePassword: async (userId: string, dto: IChangePasswordDTO): Promise<void> => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) throw ApiError.notFound('User not found');

    const isValid = await comparePassword(dto.currentPassword, user.passwordHash);
    if (!isValid) throw ApiError.badRequest('Current password is incorrect');

    const newHash = await hashPassword(dto.newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });
  },

  deleteAccount: async (userId: string): Promise<void> => {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  },

  savePushToken: async (userId: string, token: string): Promise<void> => {
    await prisma.user.update({
      where: { id: userId },
      data: { expoPushToken: token },
    });
  },
};
