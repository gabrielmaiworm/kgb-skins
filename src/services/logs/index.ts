import { AxiosResponse } from "axios";
import api from "../axiosNodeApi";
import { ListLogsRequest, ListLogsResponse } from "../../@types/logs";

/**
 * Listar logs com filtros e paginação
 */
export async function listLogsService(params?: ListLogsRequest): Promise<AxiosResponse<ListLogsResponse>> {
  return await api.get("/logs/list", { params });
}
