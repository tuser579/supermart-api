import { TokenPayload } from '../config/jwt.config';
export interface GeneratedTokens {
    accessToken: string;
    refreshToken: string;
}
export declare const generateTokens: (payload: TokenPayload) => GeneratedTokens;
//# sourceMappingURL=generateToken.d.ts.map