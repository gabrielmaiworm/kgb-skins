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
    if (config?.ignoreBearerToken) return config;

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

let refreshPromise: Promise<string> | null = null;

async function executeRefresh(): Promise<string> {
  const res = await actionRefreshToken();
  if (!res.success || !res.data?.access_token) {
    const errMsg = res.error || "Refresh token failed";
    const cookieStore = await cookies();

    if (
      errMsg.includes("No refresh token found") ||
      errMsg.includes("Token is not active") ||
      errMsg.includes("Token expired") ||
      errMsg.includes("Refresh token inválido")
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

    throw new Error(errMsg);
  }
  return res.data.access_token;
}

api.interceptors.response.use(
  (res: any) => {
    return res;
  },
  async (error) => {
    const originalConfig = error.config;

    if (error?.response) {
      if (originalConfig?.ignoreBearerToken) {
        return Promise.reject(error);
      }

      if (error?.response?.status === 401 && !originalConfig._retry) {
        if (error?.response?.data?.message === "Invalid credentials") {
          return Promise.reject(error);
        }
        originalConfig._retry = true;

        if (!refreshPromise) {
          refreshPromise = executeRefresh().finally(() => {
            refreshPromise = null;
          });
        }

        try {
          const newAccessToken = await refreshPromise;
          originalConfig._newAccessToken = newAccessToken;
          return api(originalConfig);
        } catch {
          return Promise.reject({
            response: {
              status: 401,
              data: { message: "Refresh token failed, redirect to login" },
            },
          });
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
