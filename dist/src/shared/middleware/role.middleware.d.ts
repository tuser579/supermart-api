import { Request, Response, NextFunction } from 'express';
/**
 * Role-based access control middleware factory.
 * Usage: requireRole('ADMIN') or requireRole('STAFF', 'ADMIN')
 */
export declare const requireRole: (...roles: string[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map