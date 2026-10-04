export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiPaginated<T> {
  success: true;
  message: string;
  data: {
    items: T[];
    pagination: PaginationMeta;
    [extra: string]: unknown;
  };
  timestamp: string;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors: ApiFieldError[];
  code: string;
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
  extra?: Record<string, unknown>;
}
