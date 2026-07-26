"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const ApiError_1 = require("../utils/ApiError");
/**
 * Role-based access control middleware factory.
 * Usage: requireRole('ADMIN') or requireRole('STAFF', 'ADMIN')
 */
const requireRole = (...roles) => {
    return (req, _res, next) => {
        const userRole = req.user?.role;
        if (!userRole) {
            return next(ApiError_1.ApiError.unauthorized('Authentication required'));
        }
        if (!roles.includes(userRole)) {
            return next(ApiError_1.ApiError.forbidden(`Access denied. Required roles: ${roles.join(', ')}`));
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=role.middleware.js.map