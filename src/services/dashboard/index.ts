import { AxiosResponse } from "axios";
import api from "../axiosNodeApi";
import { DashboardResponse } from "@/@types/dashboard";

/**
 * Buscar métricas do dashboard
 */
export async function getDashboardService(): Promise<AxiosResponse<DashboardResponse>> {
  return await api.get("/dashboard");
}
