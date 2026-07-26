export declare class ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
    meta?: Record<string, unknown>;
    constructor(statusCode: number, message: string, data: T, meta?: Record<string, unknown>);
    static success<T>(message: string, data: T, meta?: Record<string, unknown>): ApiResponse<T>;
    static created<T>(message: string, data: T): ApiResponse<T>;
    static paginated<T>(message: string, data: T[], page: number, limit: number, total: number): ApiResponse<T[]>;
}
//# sourceMappingURL=ApiResponse.d.ts.map