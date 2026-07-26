export interface IUserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    profileImage?: string | null;
    isVerified: boolean;
    isActive: boolean;
    lastLogin?: Date | null;
    createdAt: Date;
}
export interface IUpdateProfileDTO {
    name?: string;
    phone?: string;
    profileImage?: string;
}
export interface IChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
}
//# sourceMappingURL=user.interface.d.ts.map