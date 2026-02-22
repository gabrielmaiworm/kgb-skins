"use server";

import { getDashboardService } from "@/services/dashboard";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function getDashboardAction() {
  try {
    const response = await getDashboardService();
    return {
      message: "Métricas do dashboard obtidas com sucesso.",
      success: true,
      issues: [] as string[],
      responseData: response.data,
    };
  } catch (error) {
    const errorMsg = await axiosErrorMessage(error, "Erro ao obter métricas do dashboard");
    return {
      message: errorMsg,
      success: false,
      issues: [errorMsg],
      responseData: undefined,
    };
  }
}
