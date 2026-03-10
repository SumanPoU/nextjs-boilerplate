/**
 * Authentication Hooks using TanStack Query
 *
 * This file contains all authentication-related hooks for:
 * - Registration
 * - Login/Logout
 * - Email verification
 * - Password management
 * - User roles/permissions
 */

import { useApiQuery, useApiMutation } from '@/hooks/api/tanstack';
import { tokenStorage } from '@/lib/api/token-storage';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  AuthResponse,
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ResendVerificationDto,
  ForgotPasswordDto,
  ForgetPasswordSetDto,
  ChangePasswordDto,
  SetFirstLoginPasswordDto,
  UserRolesResponse,
  User,
  LogoutDto,
  GetUserRolesDto,
} from '@/types/auth';
import toast from 'react-hot-toast';

/*
 * Hook to register a new user
 *
 * @example
 * const register = useRegister();
 *
 * const handleRegister = async (formData) => {
 *   try {
 *     await register.mutateAsync(formData);
 *     router.push('/verify-email');
 *   } catch (error) {
 *     toast.error(error.message);
 *   }
 * };
 */

export function useRegister() {
  const router = useRouter();

  return useApiMutation<AuthResponse, RegisterDto>({
    endpoint: '/auth/register',
    method: 'POST',
    options: {
      onSuccess: (response) => {
        toast.success(response.message || 'Registration successful');
        router.push('/verify-email');
      },
      onError: (error) => {
        toast.error(error.message || 'Registration failed');
      },
    },
  });
}

/**
 * Hooks to resend email verification OTP
 *
 * @example
 * const resendVerification = useResendVerification();
 *
 * resendVerification.mutate({ email: 'user@example.com' });
 */

export function useResendVerification() {
  return useApiMutation<AuthResponse, ResendVerificationDto>({
    endpoint: '/resend-verification',
    method: 'POST',
    options: {
      onSuccess: (response) => {
        toast.success(response.message || 'Verification OTP resent');
      },
      onError: (error) => {
        toast.error(error.message || 'Verification OTP resend failed');
      },
    },
  });
}

/*
 * Hook to verify email
 *
 * @example
 * const verifyEmail = useVerifyEmail();
 *
 * const handleVerifyEmail = async (formData) => {
 *   try {
 *     await verifyEmail.mutateAsync(formData);
 *     router.push('/login');
 *   } catch (error) {
 *     toast.error(error.message);
 *   }
 * };
 */

export function useVerifyEmail() {
  const router = useRouter();

  return useApiMutation<AuthResponse, VerifyEmailDto>({
    endpoint: '/verify-email',
    method: 'POST',
    options: {
      onSuccess: (response) => {
        toast.success(response.message || 'Email verified');
        router.push('/login');
      },
      onError: (error) => {
        toast.error(error.message || 'Email verification failed');
      },
    },
  });
}

/*
 * Hook to login
 *
 * @example
 * const login = useLogin();
 *
 * const handleLogin = async (formData) => {
 *   try {
 *     await login.mutateAsync(formData);
 *     router.push('/dashboard');
 *   } catch (error) {
 *     toast.error(error.message);
 *   }
 * };
 */

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useApiMutation<AuthResponse, LoginDto>({
    endpoint: '/auth/login',
    method: 'POST',
    options: {
      onSuccess: (response) => {
        // Store tokens
        tokenStorage.setToken(response.data.access_token);
        tokenStorage.setRefreshToken(response.data.refresh_token);

        // Store user data in cache
        queryClient.setQueryData(['currentUser'], response.data.user);

        // Clear any previous errors
        toast.success(response.message || 'Logged in successfully');

        // Redirect based on user status
        if (response.data.user.isFirstLogin) {
          router.push('/set-first-password');
        } else {
          router.push('/dashboard');
        }
      },
      onError: (error) => {
        toast.error(error.message || 'Login failed');
      },
    },
  });
}

/*
 * Hooks to set Password on first login
 *
 * @example
 * const setFirstLoginPassword = useSetFirstLoginPassword();
 *
 * const handleSetFirstLoginPassword = async (formData) => {
 *   try {
 *     await setFirstLoginPassword.mutateAsync(formData);
 *     router.push('/dashboard');
 *   } catch (error) {
 *     toast.error(error.message);
 *   }
 * };
 */

export function useSetFirstLoginPassword() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useApiMutation<AuthResponse, SetFirstLoginPasswordDto>({
    endpoint: '/set-first-login-password',
    method: 'POST',
    options: {
      onSuccess: (response) => {
        // Store tokens
        tokenStorage.setToken(response.data.access_token);
        tokenStorage.setRefreshToken(response.data.refresh_token);

        // Store user data in cache
        queryClient.setQueryData(['currentUser'], response.data.user);

        toast.success(response.message || 'Password set successfully');
        router.push('/dashboard');
      },
      onError: (error) => {
        toast.error(error.message || 'Password set failed');
      },
    },
  });
}

/*
 *
 * Hook to send forgot password email with OTP
 *
 * @example
 * const sendForgotPassword = useSendForgotPasswordEmail();
 *
 * sendForgotPassword.mutate({ email: 'user@example.com' });
 */

export function useSendForgotPasswordEmail() {
  return useApiMutation<AuthResponse, ForgotPasswordDto>({
    endpoint: '/forgot-password',
    method: 'POST',
    options: {
      onSuccess: (response) => {
        toast.success(response.message || 'Email sent');
      },
      onError: (error) => {
        toast.error(error.message || 'Email send failed');
      },
    },
  });
}

/*
 * Hook to reset password using OTP from email
 *
 * @example
 * const resetPassword = useForgetPasswordSet();
 *
 * const handleReset = async () => {
 *   try {
 *     await resetPassword.mutateAsync({
 *       email,
 *       otp,
 *       newPassword,
 *       confirmPassword,
 *     });
 *     router.push('/login');
 *   } catch (error) {
 *     toast.error('Invalid or expired OTP');
 *   }
 * };
 */

export function useForgetPasswordSet() {
  const router = useRouter();

  return useApiMutation<AuthResponse, ForgetPasswordSetDto>({
    endpoint: '/set-password',
    method: 'POST',
    options: {
      onSuccess: (response) => {
        toast.success(response.message || 'Password reset successfully');
        router.push('/login');
      },
      onError: (error) => {
        toast.error(error.message || 'Password reset failed');
      },
    },
  });
}

/**
 * Hook to change password when user is already logged in
 * Requires authentication
 *
 * @example
 * const resetPassword = useResetPassword();
 *
 * resetPassword.mutate({
 *   oldPassword: 'current123',
 *   newPassword: 'newSecure456',
 *   confirmPassword: 'newSecure456',
 * });
 */

export function useResetPassword() {
  return useApiMutation<AuthResponse, ChangePasswordDto>({
    endpoint: '/reset-password',
    method: 'POST',
    options: {
      onSuccess: (response) => {
        toast.success(response.message || 'Password changed successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Password change failed');
      },
    },
  });
}

/*
 * Hooks to logout from current device
 *
 * @example
 * const logout = useLogout();
 *
 * const handleLogout = () => {
 *   logout.mutate();
 * };
 */

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useApiMutation<{ message: string }, void>({
    endpoint: '/logout',
    method: 'POST',
    options: {
      onMutate: async () => {
        // Get refresh token before clearing
        const refreshToken = tokenStorage.getRefreshToken();
        return { refreshToken };
      },
      onSuccess: (response, variables, context) => {
        // Clear tokens
        tokenStorage.clearAll();

        // Clear all cached data
        queryClient.clear();

        toast.success(response.message || 'Logged out successfully');

        // Redirect to login
        router.push('/login');
      },
      onError: (error, variables, context) => {
        // Even if API fails, clear local tokens
        tokenStorage.clearAll();
        queryClient.clear();
        router.push('/login');
      },
    },
  });
}

/**
 * Hook to logout from all devices
 *
 * @example
 * const logoutAll = useLogoutAllDevices();
 *
 * const handleLogoutAll = () => {
 *   if (confirm('Logout from all devices?')) {
 *     logoutAll.mutate();
 *   }
 * };
 */

export function useLogoutAllDevices() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useApiMutation<{ message: string }, void>({
    endpoint: '/logout-all-devices',
    method: 'POST',
    options: {
      onSuccess: (response) => {
        // Clear tokens
        tokenStorage.clearAll();

        // Clear all cached data
        queryClient.clear();

        toast.success(response.message || 'Logged out successfully');

        // Redirect to login
        router.push('/login');
      },
      onError: (error) => {
        // Even if API fails, clear local tokens
        tokenStorage.clearAll();
        queryClient.clear();
        router.push('/login');
      },
    },
  });
}

/**
 * Hook to fetch user roles and permissions
 * Requires authentication
 *
 * @example
 * const { data, isLoading } = useUserRoles();
 *
 * if (data?.data.permissions.some(p => p.name === 'users.create')) {
 *   // User can create users
 * }
 */
export function useUserRoles(userId?: number) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useApiMutation<UserRolesResponse, GetUserRolesDto>({
    endpoint: '/get-user-roles-permissions',
    method: 'POST',
    options: {
      onSuccess: (response) => {
        tokenStorage.setPermissionRole(JSON.stringify(response));

        // Store user roles and permissions in cache
        queryClient.setQueryData(['userRoles', userId], response.data);
      },
      onError: (error) => {
        // Even if API fails, clear local data
        queryClient.clear();
        router.push('/login');
      },
    },
  });
}

/**
 * Hook to get currently logged-in user
 * Uses cached data if available, otherwise fetches from API
 *
 * @example
 * const { data: user, isLoading } = useCurrentUser();
 *
 * if (user) {
 *   console.log('Logged in as:', user.name);
 * }
 */
export function useCurrentUser() {
  const queryClient = useQueryClient();

  return useApiQuery<{ data: User }>({
    endpoint: '/auth/me', // Adjust this endpoint based on your API
    queryKey: ['currentUser'],
    options: {
      enabled: !!tokenStorage.getToken(),
      staleTime: 10 * 60 * 1000, // Fresh for 10 minutes

      // Try to use cached data first
      initialData: () => {
        const cachedUser = queryClient.getQueryData<User>(['currentUser']);
        return cachedUser ? { data: cachedUser } : undefined;
      },
    },
  });
}
