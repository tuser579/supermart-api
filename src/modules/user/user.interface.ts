export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profileImage?: string | null;
  avatar?: string | null;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
}

export interface IUpdateProfileDTO {
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  avatar?: string;
  photo?: string;
}

export interface IChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}
