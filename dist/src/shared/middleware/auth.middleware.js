"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_config_1 = require("../config/jwt.config");
const ApiError_1 = require("../utils/ApiError");
const database_config_1 = require("../config/database.config");
const authMiddleware = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError_1.ApiError.unauthorized('Authorization token required');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt_config_1.jwtConfig.verifyAccessToken(token);
        // Verify user still exists and is active
        const user = await database_config_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true, isActive: true },
        });
        if (!user) {
            throw ApiError_1.ApiError.unauthorized('User no longer exists');
        }
        if (!user.isActive) {
            throw ApiError_1.ApiError.unauthorized('User account has been deactivated');
        }
        req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map