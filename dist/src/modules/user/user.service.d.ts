import { IUpdateProfileDTO, IChangePasswordDTO, IUserProfile } from './user.interface';
export declare const userService: {
    getProfile: (userId: string) => Promise<IUserProfile>;
    updateProfile: (userId: string, dto: IUpdateProfileDTO) => Promise<IUserProfile>;
    changePassword: (userId: string, dto: IChangePasswordDTO) => Promise<void>;
    deleteAccount: (userId: string) => Promise<void>;
    savePushToken: (userId: string, token: string) => Promise<void>;
};
//# sourceMappingURL=user.service.d.ts.map