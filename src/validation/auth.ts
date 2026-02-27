import { z } from 'zod';
import { safeString } from './common';

/**
 * Username: letters, numbers, underscores only + safe
 */
export const safeUsername = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(32, 'Username too long')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
  .refine(
    (val) => !/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|EXEC|UNION)\b)/i.test(val),
    {
      message: 'Username cannot contain SQL keywords',
    },
  );

/**
 * Strong password: min 8 chars, max 64, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export const StrongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must be at most 64 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Base IdentifierSchema as ZodObject (no refine yet)
 */
const BaseIdentifierSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  userName: safeUsername.optional(),
});

/**
 * Login Schema
 */
export const LoginSchema = BaseIdentifierSchema.extend({
  password: StrongPasswordSchema,
  deviceInfo: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
}).refine((data) => data.email || data.userName, {
  message: 'Either email or username is required',
  path: ['email'],
});

export const LoginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: StrongPasswordSchema,
  deviceInfo: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

/**
 * Set First Login Password Schema
 */
export const SetFirstLoginPasswordSchema = BaseIdentifierSchema.extend({
  newPassword: StrongPasswordSchema,
  confirmPassword: z.string(),
  deviceInfo: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
})
  .refine((data) => data.email || data.userName, {
    message: 'Either email or username is required',
    path: ['email'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

/**
 * Forgot Password Schema
 */
export const ForgotPasswordSchema = BaseIdentifierSchema.refine(
  (data) => data.email || data.userName,
  {
    message: 'Either email or username is required',
    path: ['email'],
  },
);

/**
 * Forget Password Set Schema
 */
export const ForgetPasswordSetSchema = BaseIdentifierSchema.extend({
  token: safeString('forget password token'),
  password: StrongPasswordSchema,
  confirmPassword: z.string(),
})
  .refine((data) => data.email || data.userName, {
    message: 'Either email or username is required',
    path: ['email'],
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
