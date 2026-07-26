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
    return {
      ...user,
      avatar: user.profileImage,
    };
  },

  updateProfile: async (userId: string, dto: IUpdateProfileDTO): Promise<IUserProfile> => {
    const profileImage = dto.profileImage ?? dto.avatar ?? dto.photo;

    // Check email uniqueness if changing
    if (dto.email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email: dto.email, NOT: { id: userId } },
      });
      if (existingEmail) throw ApiError.conflict('Email address is already in use');
    }

    // Check phone uniqueness if changing
    if (dto.phone) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone: dto.phone, NOT: { id: userId } },
      });
      if (existingPhone) throw ApiError.conflict('Phone number is already in use');
    }

    const updateData: {
      name?: string;
      email?: string;
      phone?: string;
      profileImage?: string;
    } = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: userSelectFields,
    });

    return {
      ...user,
      avatar: user.profileImage,
    };
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
