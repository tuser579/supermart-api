export class ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;

  constructor(
    statusCode: number,
    message: string,
    data: T,
    meta?: Record<string, unknown>
  ) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }

  static success<T>(
    message: string,
    data: T,
    meta?: Record<string, unknown>
  ): ApiResponse<T> {
    return new ApiResponse(200, message, data, meta);
  }

  static created<T>(message: string, data: T): ApiResponse<T> {
    return new ApiResponse(201, message, data);
  }

  static paginated<T>(
    message: string,
    data: T[],
    page: number,
    limit: number,
    total: number
  ): ApiResponse<T[]> {
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
