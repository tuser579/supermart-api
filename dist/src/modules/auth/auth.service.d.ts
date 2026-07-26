import { IRegisterDTO, ILoginDTO, IVerifyOTPDTO, IAuthResponse } from './auth.interface';
export declare const authService: {
    /**
     * Register a new user
     */
    register: (dto: IRegisterDTO) => Promise<IAuthResponse>;
    /**
     * Login an existing user
     */
    login: (dto: ILoginDTO) => Promise<IAuthResponse>;
    /**
     * Verify OTP and mark user as verified
     */
    verifyOTP: (dto: IVerifyOTPDTO) => Promise<{
        message: string;
    }>;
    /**
     * Resend OTP
     */
    resendOTP: (email: string) => Promise<{
        message: string;
    }>;
    /**
     * Refresh access token
     */
    refreshToken: (refreshToken: string) => Promise<{
        accessToken: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map