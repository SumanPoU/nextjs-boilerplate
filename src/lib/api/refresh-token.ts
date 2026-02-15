import { API_BASE_URL } from '@/lib/api/config';
import { tokenStorage } from './token-storage';
import { BackendResponse } from '@/types/api';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const res = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!res.ok) throw new Error('Refresh failed');

      const result: BackendResponse<{
        access_token: string;
        refresh_token?: string;
      }> = await res.json();

      if (!result.success || !result.data) {
        throw new Error(result.message);
      }

      tokenStorage.setToken(result.data.access_token);

      if (result.data.refresh_token) {
        tokenStorage.setRefreshToken(result.data.refresh_token);
      }

      return result.data.access_token;
    } catch (err) {
      tokenStorage.clearAll();
      window.dispatchEvent(new CustomEvent('auth:logout'));
      throw err;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
