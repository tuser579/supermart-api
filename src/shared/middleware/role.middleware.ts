import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

/**
 * Role-based access control middleware factory.
 * Usage: requireRole('ADMIN') or requireRole('STAFF', 'ADMIN')
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!roles.includes(userRole)) {
      return next(
        ApiError.forbidden(`Access denied. Required roles: ${roles.join(', ')}`)
      );
    }

    next();
  };
};
