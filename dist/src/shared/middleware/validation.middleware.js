"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
const validate = (schema, target = 'body') => {
    return (req, _res, next) => {
        try {
            const parsed = schema.parse(req[target]);
            req[target] = parsed;
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const errors = err.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                return next(new ApiError_1.ApiError(400, 'Validation failed', errors));
            }
            next(err);
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validation.middleware.js.map