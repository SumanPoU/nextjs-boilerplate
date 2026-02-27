import { z } from 'zod';

/**
 * Safe string helper: blocks dangerous characters and SQL keywords
 * Keeps string methods like .email() and .url()
 */
export const safeString = (fieldName: string, min = 1, max = 255) =>
  z
    .string()
    .min(min, `${fieldName} is required`)
    .max(max, `${fieldName} is too long`)
    .refine(
      (val) =>
        !/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|EXEC|UNION)\b|;|--|'|"|`)/i.test(val),
      { message: `${fieldName} contains invalid characters or SQL keywords` },
    );
