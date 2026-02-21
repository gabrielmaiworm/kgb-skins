import { AxiosResponse } from "axios";
import api from "../axiosNodeApi";
import {
  LoginRequest,
  LoginResponse,
  LoginWithPhoneRequest,
  LoginWithPhoneResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/@types/auth";

/**
 * Login com email e senha
 */
export async function loginService(data: LoginRequest): Promise<AxiosResponse<LoginResponse>> {
  return await api.post("/auth/login", data, { ignoreBearerToken: true } as any);
}

/**
 * Login apenas com CPF (para usuários públicos sem senha)
 */
export async function loginWithPhoneService(
  data: LoginWithPhoneRequest
): Promise<AxiosResponse<LoginWithPhoneResponse>> {
  return await api.post("/auth/login/phone", data, { ignoreBearerToken: true } as any);
}

/**
 * Renovar token de acesso
 */
export async function refreshTokenService(data: RefreshTokenRequest): Promise<AxiosResponse<RefreshTokenResponse>> {
  return await api.post("/auth/refresh", data, { ignoreBearerToken: true } as any);
}

/**
 * Fazer logout
 */
export async function logoutService(data: LogoutRequest): Promise<AxiosResponse<LogoutResponse>> {
  return await api.post("/auth/logout", data, { ignoreBearerToken: true } as any);
}

/**
 * Solicitar recuperação de senha
 */
export async function forgotPasswordService(
  data: ForgotPasswordRequest
): Promise<AxiosResponse<ForgotPasswordResponse>> {
  return await api.post("/auth/forgot-password", data, { ignoreBearerToken: true } as any);
}

/**
 * Resetar senha com código de verificação
 */
export async function resetPasswordService(data: ResetPasswordRequest): Promise<AxiosResponse<ResetPasswordResponse>> {
  return await api.post("/auth/reset-password", data, { ignoreBearerToken: true } as any);
}
