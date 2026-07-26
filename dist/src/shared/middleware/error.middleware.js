"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const logger_1 = require("../utils/logger");
const errorMiddleware = (err, req, res, _next) => {
    // Default error values
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors = [];
    if (err instanceof ApiError_1.ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    }
    // Log error details
    if (statusCode >= 500) {
        logger_1.logger.error(`[${req.method}] ${req.path} - ${statusCode}: ${err.message}`, {
            stack: err.stack,
            body: req.body,
        });
    }
    else {
        logger_1.logger.warn(`[${req.method}] ${req.path} - ${statusCode}: ${message}`);
    }
    res.status(statusCode).json({
        success: false,
        message,
        errors: errors.length > 0 ? errors : undefined,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map