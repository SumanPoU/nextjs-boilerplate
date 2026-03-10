export interface FieldError {
  field: string;
  message: string;
}

export interface BackendResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: FieldError[];
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: FieldError[];
}

export type QueryParams = Record<string, string | number | boolean | null | undefined>;
