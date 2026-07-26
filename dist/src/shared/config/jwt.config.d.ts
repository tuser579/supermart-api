export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}
export declare const jwtConfig: {
    signAccessToken: (payload: TokenPayload) => string;
    signRefreshToken: (payload: TokenPayload) => string;
    verifyAccessToken: (token: string) => TokenPayload;
    verifyRefreshToken: (token: string) => TokenPayload;
};
//# sourceMappingURL=jwt.config.d.ts.map