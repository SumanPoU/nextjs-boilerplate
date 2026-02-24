function getEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  BACKEND_URL: getEnv('BACKEND_URL'),
  ENCRYPTION_KEY: getEnv('ENCRYPTION_KEY'),
  IV_LENGTH: Number(getEnv('IV_LENGTH')),
};
