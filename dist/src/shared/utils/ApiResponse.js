"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(statusCode, message, data, meta) {
        this.success = statusCode >= 200 && statusCode < 300;
        this.message = message;
        this.data = data;
        if (meta)
            this.meta = meta;
    }
    static success(message, data, meta) {
        return new ApiResponse(200, message, data, meta);
    }
    static created(message, data) {
        return new ApiResponse(201, message, data);
    }
    static paginated(message, data, page, limit, total) {
        return new ApiResponse(200, message, data, {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        });
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map