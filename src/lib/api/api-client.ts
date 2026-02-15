import { API_BASE_URL, AUTH_ENDPOINTS } from './config';
import { refreshAccessToken } from './refresh-token';
import { tokenStorage } from './token-storage';
import { BackendResponse, ApiError, QueryParams } from '@/types/api';

const isAuthEndpoint = (endpoint: string) => AUTH_ENDPOINTS.some((path) => endpoint.includes(path));

async function request<T>(endpoint: string, options: RequestInit = {}, retry = 0): Promise<T> {
  const token = tokenStorage.getToken();

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && retry === 0 && !isAuthEndpoint(endpoint)) {
    await refreshAccessToken();
    return request<T>(endpoint, options, 1);
  }

  const result: BackendResponse<T> = await response.json();

  if (!response.ok || !result.success) {
    throw {
      message: result.message,
      status: response.status,
      errors: result.errors,
    } as ApiError;
  }

  return result.data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, params?: QueryParams) => {
    let url = endpoint;

    if (params) {
      const filteredParams = Object.entries(params).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      const query = new URLSearchParams(filteredParams).toString();

      if (query) {
        url += `?${query}`;
      }
    }

    return request<T>(url, { method: 'GET' });
  },

  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
