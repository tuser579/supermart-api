export interface IRegisterDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface ILoginDTO {
  email: string;
  password: string;
}

export interface IVerifyOTPDTO {
  email: string;
  otp: string;
}

export interface IRefreshTokenDTO {
  refreshToken: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
  };
  tokens: IAuthTokens;
}

export interface IOTPStore {
  [email: string]: {
    otp: string;
    expiresAt: Date;
  };
}
