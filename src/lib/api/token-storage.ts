import { BrowserCryptoService } from '@/lib/encryption';

export const tokenStorage = {
  async setToken(token: string) {
    if (typeof window === 'undefined') return;
    const encrypted = await BrowserCryptoService.encrypt(token);
    localStorage.setItem('auth_token', encrypted);
  },

  async getToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    const encrypted = localStorage.getItem('auth_token');
    if (!encrypted) return null;
    try {
      return await BrowserCryptoService.decrypt(encrypted);
    } catch {
      return null;
    }
  },

  removeToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  },

  async setRefreshToken(token: string) {
    if (typeof window === 'undefined') return;
    const encrypted = await BrowserCryptoService.encrypt(token);
    localStorage.setItem('refresh_token', encrypted);
  },

  async getRefreshToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    const encrypted = localStorage.getItem('refresh_token');
    if (!encrypted) return null;
    try {
      return await BrowserCryptoService.decrypt(encrypted);
    } catch {
      return null;
    }
  },

  async setPermissionRole(role: string) {
    if (typeof window === 'undefined') return;
    const encrypted = await BrowserCryptoService.encrypt(role);
    localStorage.setItem('permission', encrypted);
  },

  async getPermissionRole(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    const encrypted = localStorage.getItem('permission');
    if (!encrypted) return null;
    try {
      return await BrowserCryptoService.decrypt(encrypted);
    } catch {
      return null;
    }
  },

  removePermissionRole() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('permission');
  },

  clearAll() {
    this.removeToken();
    this.removePermissionRole();
    localStorage.removeItem('refresh_token');
  },
};
