export interface AuthResponse {
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
  message: string;
}

export interface RegisterDto {
  displayName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyEmailDto {
  email: string;
  otp: string;
}

export interface ResendVerificationDto {
  email: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ForgetPasswordSetDto {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface SetFirstLoginPasswordDto {
  email: string;
  temporaryPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface LogoutDto {
  refresh_token: string;
}

export interface GetUserRolesDto {
  userId?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  isFirstLogin: boolean;
  roles?: Role[];
  permissions?: Permission[];
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
}

export interface UserRolesResponse {
  data: {
    user: User;
    roles: Role[];
    permissions: Permission[];
  };
  message: string;
}
