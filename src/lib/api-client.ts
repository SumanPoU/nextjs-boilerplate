const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export interface ApiError {
  message: string;
  status?: number;
  error_code?: number;
  error?: boolean;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Token storage utilities for managing auth tokens in localStorage
 */
export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    const encodedToken = localStorage.getItem('auth_token');
    if (!encodedToken) return null;
    try {
      return atob(encodedToken);
    } catch (error) {
      console.error('Failed to decode auth token:', error);
      return null;
    }
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const encodedToken = btoa(token);
      localStorage.setItem('auth_token', encodedToken);
    } catch (error) {
      console.error('Failed to encode auth token:', error);
    }
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    const encodedToken = localStorage.getItem('refresh_token');
    if (!encodedToken) return null;
    try {
      return atob(encodedToken);
    } catch (error) {
      console.error('Failed to decode refresh token:', error);
      return null;
    }
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const encodedToken = btoa(token);
      localStorage.setItem('refresh_token', encodedToken);
    } catch (error) {
      console.error('Failed to encode refresh token:', error);
    }
  },

  removeRefreshToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('refresh_token');
  },

  clearAll: (): void => {
    tokenStorage.removeToken();
    tokenStorage.removeRefreshToken();
  },
};

/**
 * Checks if an endpoint is an authentication endpoint
 */
const isAuthEndpoint = (endpoint: string): boolean => {
  const authEndpoints = [
    '/login',
    '/refresh-token',
    '/logout',
    '/auth/signup',
    '/auth/verify-otp',
    '/auth/resend-otp',
    '/auth/set-new-password',
  ];
  return authEndpoints.some((authPath) => endpoint.includes(authPath));
};

/**
 * Refreshes the access token using the refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      if (data?.data?.access_token) {
        tokenStorage.setToken(data.data.access_token);
        if (data?.data?.refresh_token) {
          tokenStorage.setRefreshToken(data.data.refresh_token);
        }
        return data.data.access_token;
      }

      throw new Error('Invalid refresh response');
    } catch (error) {
      tokenStorage.clearAll();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Main API client for making HTTP requests
 */
export const apiClient = {
  /**
   * Make a generic API request
   */
  async request<T>(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<T> {
    try {
      const token = tokenStorage.getToken();
      const isFormData = options.body instanceof FormData;

      const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      if (isFormData) {
        delete headers['Content-Type'];
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        redirect: 'manual',
      });

      // Handle redirects (3xx status codes)
      if (response.status >= 300 && response.status < 400 && response.status !== 304) {
        if (token && retryCount === 0 && !isAuthEndpoint(endpoint)) {
          try {
            await refreshAccessToken();
            return this.request<T>(endpoint, options, retryCount + 1);
          } catch (refreshError) {
            throw refreshError;
          }
        }
        throw {
          message: 'Authentication required. Please login to continue.',
          status: response.status,
        } as ApiError;
      }

      // Handle unauthorized requests
      if (response.status === 401 && retryCount === 0) {
        if (!isAuthEndpoint(endpoint)) {
          try {
            await refreshAccessToken();
            return this.request<T>(endpoint, options, retryCount + 1);
          } catch (refreshError) {
            throw refreshError;
          }
        }
      }

      // Handle error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText || 'An error occurred',
        }));
        throw {
          message: errorData?.message || errorData?.error || 'Request failed',
          status: response.status,
          error_code: errorData?.error_code,
          error: errorData?.error,
          errors: errorData?.errors,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw error as ApiError;
      }
      throw {
        message: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError;
    }
  },

  /**
   * GET request
   */
  get<T>(
    endpoint: string,
    params?: Record<string, string | number | string[] | undefined>,
  ): Promise<T> {
    let url = endpoint;
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(`${key}[]`, String(v)));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += (endpoint.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  },

  /**
   * POST request
   */
  post<T>(endpoint: string, data: unknown): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  /**
   * PUT request
   */
  put<T>(endpoint: string, data: unknown): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, data: unknown): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
};
