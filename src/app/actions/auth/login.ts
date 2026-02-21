"use server";

import { loginService, loginWithPhoneService } from "@/services/auth";
import { axiosErrorMessage } from "@/utils/errorMessage";
import { JwtPayloadCustom } from "@/utils/parseJwt";
import { cookies } from "next/headers";

interface EmailLoginInterface {
  email: string;
  password: string;
  loginType: "email";
}

interface PhoneLoginInterface {
  phone: string;
  loginType: "phone";
}

type LoginInterface = EmailLoginInterface | PhoneLoginInterface;

type FormState = {
  message: string;
  success: boolean;
  fields?: Record<string, FormDataEntryValue>;
  data?: any;
};

function parseJwt(token: string): JwtPayloadCustom {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    throw new Error("Token inválido");
  }
}

export async function nodeLogin(loginProps: LoginInterface): Promise<FormState> {
  try {
    console.log("Iniciando processo de login com os dados:", loginProps);

    const response =
      loginProps.loginType === "email"
        ? await loginService({ email: loginProps.email, password: loginProps.password })
        : await loginWithPhoneService({ phone: loginProps.phone });

    const data = response.data;
    const decodedToken = parseJwt(data.access_token);

    if (!response.data || !response.data.access_token) {
      console.error("Resposta de login sem tokens:", response.data);
      return {
        success: false,
        message: "Erro no login: tokens não encontrados na resposta do servidor",
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("kgb-admin-access-token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15,
    });

    cookieStore.set("kgb-admin-refresh-token", data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      message: "Login realizado com sucesso. Aguarde o redirecionamento.",
      success: true,
      data: {
        userId: decodedToken.userId ?? decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role,
        phone: decodedToken.phone,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        invite_count: decodedToken.invite_count ?? 0,
        invite_code: decodedToken.invite_code,
        has_referred_by_invite_code: decodedToken.has_referred_by_invite_code ?? false,
      },
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao realizar login", false, true);
    return {
      success: false,
      message: errorMessage,
    };
  }
}
