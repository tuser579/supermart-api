import { Request, Response, NextFunction } from 'express';
import { jwtConfig, TokenPayload } from '../config/jwt.config';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../config/database.config';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authorization token required');
    }

    const token = authHeader.split(' ')[1];
    const decoded: TokenPayload = jwtConfig.verifyAccessToken(token);

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user) {
      throw ApiError.unauthorized('User no longer exists');
    }

    if (!user.isActive) {
      throw ApiError.unauthorized('User account has been deactivated');
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
