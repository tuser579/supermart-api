import { jwtConfig, TokenPayload } from '../config/jwt.config';

export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = (payload: TokenPayload): GeneratedTokens => {
  const accessToken = jwtConfig.signAccessToken(payload);
  const refreshToken = jwtConfig.signRefreshToken(payload);
  return { accessToken, refreshToken };
};
