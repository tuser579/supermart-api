"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_change_in_production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d');
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || '30d');
exports.jwtConfig = {
    signAccessToken: (payload) => {
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    },
    signRefreshToken: (payload) => {
        return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
    },
    verifyAccessToken: (token) => {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch {
            throw new ApiError_1.ApiError(401, 'Invalid or expired access token');
        }
    },
    verifyRefreshToken: (token) => {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
        }
        catch {
            throw new ApiError_1.ApiError(401, 'Invalid or expired refresh token');
        }
    },
};
//# sourceMappingURL=jwt.config.js.map