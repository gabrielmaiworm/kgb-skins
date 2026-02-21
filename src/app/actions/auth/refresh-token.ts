"use server";

import { RefreshToken } from "@/services/auth/refresh-token";
import { axiosErrorMessage } from "@/utils/errorMessage";
import { cookies } from "next/headers";

export async function actionRefreshToken() {
  try {
    const response = await RefreshToken();
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Erro ao atualizar o token");
    }
    const cookieStore = await cookies();

    cookieStore.set("kgb-admin-access-token", responseData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15,
    });

    cookieStore.set("kgb-admin-refresh-token", responseData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao atualizar o token", false, true);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
