import { AxiosResponse } from "axios";
import api from "../axiosNodeApi";
import {
  ListChangelogRequest,
  ListChangelogResponse,
  CreateChangelogRequest,
  CreateChangelogResponse,
} from "../../@types/changelog";

/**
 * Listar changelog com paginação
 */
export async function listChangelogService(
  params?: ListChangelogRequest
): Promise<AxiosResponse<ListChangelogResponse>> {
  return await api.get("/changelog", { params });
}

/**
 * Criar entrada no changelog
 */
export async function createChangelogService(
  data: CreateChangelogRequest
): Promise<AxiosResponse<CreateChangelogResponse>> {
  return await api.post("/changelog", data);
}
