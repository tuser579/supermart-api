import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
export declare const errorMiddleware: (err: Error | ApiError, req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map