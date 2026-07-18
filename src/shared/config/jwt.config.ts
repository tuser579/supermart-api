import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_change_in_production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as SignOptions['expiresIn'];

export const jwtConfig = {
  signAccessToken: (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  signRefreshToken: (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
  },

  verifyAccessToken: (token: string): TokenPayload => {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      throw new ApiError(401, 'Invalid or expired access token');
    }
  },

  verifyRefreshToken: (token: string): TokenPayload => {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    } catch {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  },
};
