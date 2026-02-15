export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },

  setToken: (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  },

  removeToken: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },

  setRefreshToken: (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refresh_token', token);
  },

  clearAll: () => {
    tokenStorage.removeToken();
    localStorage.removeItem('refresh_token');
  },
};
