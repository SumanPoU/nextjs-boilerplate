declare namespace NodeJS {
  interface ProcessEnv {
    BACKEND_URL: string;
    ENCRYPTION_KEY: string;
    IV_LENGTH: string;
    NEXT_PUBLIC_BACKEND_URL?: string;
  }
}
