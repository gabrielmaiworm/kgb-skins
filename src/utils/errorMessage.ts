"use server";
import { ApiErrorDetail } from "@/@types/error";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function errorMessagesArray(error: any): Promise<ApiErrorDetail[]> {
  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.map((err: ApiErrorDetail) => ({ field: err.field, message: err.message }));
  }
  if (Array.isArray(error)) {
    return error.map((err: any) => ({ field: err.field, message: err.message }));
  }
  if (typeof error === "string") {
    try {
      const arr = JSON.parse(error);
      if (Array.isArray(arr)) {
        return arr.map((err: any) => ({ field: err.field, message: err.message }));
      }
    } catch {}
  }
  return [
    {
      field: undefined,
      message: typeof error === "object" && error?.message ? error.message : "Ocorreu um erro inesperado.",
    },
  ];
}

export async function axiosErrorMessage(
  error: any,
  message: string,
  stack?: boolean,
  ignoreUserUnauthenticated?: boolean
): Promise<string> {
  const session = await getServerSession();

  const errorMessage = () => {
    if (error?.response?.data && error?.response?.data.details && Array.isArray(error?.response?.data.details)) {
      return error?.response?.data.details.map((detail: any) => detail.message).join(", ");
    } else if (error?.response?.data && error?.response?.data.message) {
      return error.response.data.message;
    } else if (error?.response?.data.error) {
      return error?.response?.data.error;
    } else if (error?.message) {
      return error.message;
    } else {
      return message;
    }
  };

  const stackError = error?.stack ? `\nStack: ${error.stack}` : "";

  const errorStatus = error?.response?.status;

  if (
    errorMessage().includes("Token JWT") ||
    errorMessage().includes("Refresh token failed") ||
    (!ignoreUserUnauthenticated && !session?.user)
  ) {
    redirect("/login");
  }

  if (process.env.NODE_ENV === "development") {
    console.error("Error in axios request:", {
      message: errorMessage(),
      status: errorStatus,
      stack: stack ? error.stack : undefined,
      errorBody:
        error?.response?.data &&
        error?.response?.data.details &&
        Array.isArray(error?.response?.data.details) &&
        error?.response?.data?.details.map((detail: any) => detail.message).join(", "),
      simpleErrorBody: JSON.stringify(error?.response?.data.errors),
    });
  }

  return `${errorMessage()} ${stack ? "Stack: " + stackError : ""}`;
}
