export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string | null;
  meta?: PaginationMeta;
  data: T | null;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  errorDetails: {
    issues?: Array<{ field: string; message: string }>;
  } | null;
}
