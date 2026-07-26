"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = exports.globalRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const ApiError_1 = require("../utils/ApiError");
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 min
const max = parseInt(process.env.RATE_LIMIT_MAX || '100');
exports.globalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(new ApiError_1.ApiError(429, 'Too many requests. Please try again later.'));
    },
});
// Stricter limiter for auth endpoints
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    handler: (_req, _res, next) => {
        next(new ApiError_1.ApiError(429, 'Too many authentication attempts. Try again in 15 minutes.'));
    },
});
//# sourceMappingURL=rateLimiter.middleware.js.map