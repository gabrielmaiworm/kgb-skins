// Auth Service Types

// Login

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

// Login with Phone
export interface LoginWithPhoneRequest {
  phone: string;
}

export interface LoginWithPhoneResponse {
  access_token: string;
  refresh_token: string;
}

// Refresh Token
export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {}

// Logout
export interface LogoutRequest {
  refresh_token: string;
}

export interface LogoutResponse {}

// Forgot Password
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {}

// Reset Password
export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {}
