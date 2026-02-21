// axiosNodeApi.ts
"use server";

import axios, { AxiosInstance } from "axios";
import { getAcessTokenServerAction } from "@/app/actions/auth/access-token-server";
import { actionRefreshToken } from "@/app/actions/auth/refresh-token";
import { cookies } from "next/headers";

export type LoginResProps = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: "Bearer";
  "not-before-policy": number;
  session_state: string;
  scope: string;
};

const URL_API: string = process.env.BASE_URL_NODE || "";

const api: AxiosInstance = axios.create({
  withCredentials: true,
  withXSRFToken: true,
  baseURL: URL_API,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
});

api.interceptors.request.use(
  async (config: any) => {
    // Se a requisição pediu para ignorar o Bearer token, não adiciona Authorization
    if (config?.ignoreBearerToken) return config;

    // Token fresco do refresh (prioridade) - evita usar cookie antigo no retry da mesma requisição
    if (config._newAccessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${config._newAccessToken}`,
      };
      delete config._newAccessToken;
      return config;
    }

    const token = await getAcessTokenServerAction();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token.value}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: ((newAccessToken: string) => void)[] = [];

api.interceptors.response.use(
  (res: any) => {
    return res;
  },
  async (error) => {
    const originalConfig = error.config;

    if (error?.response) {
      // Se a requisição original pediu para ignorar o Bearer, não tenta refresh; só rejeita
      if (originalConfig?.ignoreBearerToken) {
        return Promise.reject(error);
      }

      if (error?.response?.status === 401 && !originalConfig._retry) {
        if (error?.response?.data?.message === "Invalid credentials") {
          return Promise.reject(error);
        }
        originalConfig._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          const cookieStore = await cookies();
          try {
            const res = await actionRefreshToken();
            if (!res.success) {
              // Lançar um erro específico para o cliente lidar com o redirecionamento
              cookieStore.set("auth-session-expired", "1", {
                path: "/",
                maxAge: 60,
                httpOnly: true,
                sameSite: "strict",
              });
              return Promise.reject({
                response: {
                  status: 401,
                  data: { message: "Refresh token failed, redirect to login" },
                },
              });
            }

            const newAccessToken = res.data?.access_token;
            if (!newAccessToken) {
              return Promise.reject({
                response: {
                  status: 401,
                  data: { message: "Refresh retornou sem access_token" },
                },
              });
            }

            // Retries usam o token fresco: cookies só atualizam na próxima requisição do browser
            originalConfig._newAccessToken = newAccessToken;
            failedQueue.forEach((callback) => callback(newAccessToken));
            failedQueue = [];
            return api(originalConfig);
          } catch (_error: any) {
            if (
              _error?.response?.data?.message === "No refresh token found" ||
              _error?.response?.data?.message === "Token is not active" ||
              _error?.response?.data?.message === "Token expired" ||
              _error?.response?.data?.message === "Refresh token inválido."
            ) {
              cookieStore.delete("kgb-admin-access-token");
              cookieStore.delete("kgb-admin-refresh-token");
            }
            cookieStore.set("auth-session-expired", "1", {
              path: "/",
              maxAge: 60,
              httpOnly: true,
              sameSite: "strict",
            });
            // Lançar erro para o cliente
            return Promise.reject({
              response: {
                status: 401,
                data: { message: "Refresh token failed, redirect to login" },
              },
            });
          } finally {
            isRefreshing = false;
          }
        } else {
          return new Promise((resolve, reject) => {
            failedQueue.push((newAccessToken: string) => {
              originalConfig._newAccessToken = newAccessToken;
              resolve(api(originalConfig));
            });
          });
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
