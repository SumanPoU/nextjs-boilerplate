import { env } from '@/config/env';

export class BrowserCryptoService {
  static async encrypt(text: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(env.IV_LENGTH));
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(env.ENCRYPTION_KEY),
      { name: 'AES-GCM' },
      false,
      ['encrypt'],
    );

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(text),
    );

    // Combine IV + encrypted text
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    // Return as base64
    return btoa(String.fromCharCode(...combined));
  }

  static async decrypt(data: string): Promise<string> {
    const combined = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, env.IV_LENGTH);
    const encrypted = combined.slice(env.IV_LENGTH);

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(env.ENCRYPTION_KEY),
      { name: 'AES-GCM' },
      false,
      ['decrypt'],
    );

    const decryptedBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);

    return new TextDecoder().decode(decryptedBuffer);
  }
}
