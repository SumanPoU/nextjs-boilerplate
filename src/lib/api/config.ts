export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export const AUTH_ENDPOINTS = [
  '/login',
  '/refresh-token',
  '/logout',
  '/auth/signup',
  '/auth/verify-otp',
  '/auth/resend-otp',
  '/auth/set-new-password',
];
