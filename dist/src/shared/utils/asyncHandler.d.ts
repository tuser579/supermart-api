import { Request, Response, NextFunction, RequestHandler } from 'express';
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Wraps an async express handler to automatically catch errors
 * and pass them to the next() error middleware.
 */
export declare const asyncHandler: (fn: AsyncRequestHandler) => RequestHandler;
export {};
//# sourceMappingURL=asyncHandler.d.ts.map