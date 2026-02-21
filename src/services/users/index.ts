import { AxiosResponse } from "axios";
import api from "../axiosNodeApi";
import {
  CreatePublicUserRequest,
  CreatePublicUserResponse,
  CreateUserRequest,
  CreateUserResponse,
  CreateAdminRequest,
  CreateAdminResponse,
  ListUsersRequest,
  ListUsersResponse,
  FindUserByIdResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
  ActivateInactiveUserRequest,
  ActivateInactiveUserResponse,
  UpdateReferrerRequest,
  UpdateReferrerResponse,
  ListInvitedUsersResponse,
} from "../../@types/users";

/**
 * Criar usuário público (sem autenticação)
 */
export async function createPublicUserService(
  data: CreatePublicUserRequest
): Promise<AxiosResponse<CreatePublicUserResponse>> {
  return await api.post("/users/create-public", data);
}

/**
 * Criar usuário (requer autenticação)
 */
export async function createUserService(data: CreateUserRequest): Promise<AxiosResponse<CreateUserResponse>> {
  return await api.post("/users/create", data);
}

/**
 * Criar usuário admin (requer autenticação)
 */
export async function createAdminService(data: CreateAdminRequest): Promise<AxiosResponse<CreateAdminResponse>> {
  return await api.post("/users/create-admin", data);
}

/**
 * Listar usuários com paginação e filtros
 */
export async function listUsersService(params?: ListUsersRequest): Promise<AxiosResponse<ListUsersResponse>> {
  return await api.get("/users/list", { params });
}

/**
 * Buscar usuário por ID
 */
export async function findUserByIdService(id: string): Promise<AxiosResponse<FindUserByIdResponse>> {
  return await api.get(`/users/find-by-id/${id}`);
}

/**
 * Atualizar usuário
 */
export async function updateUserService(
  id: string,
  data: UpdateUserRequest
): Promise<AxiosResponse<UpdateUserResponse>> {
  return await api.put(`/users/update/${id}`, data);
}

/**
 * Deletar usuário
 */
export async function deleteUserService(id: string): Promise<AxiosResponse<DeleteUserResponse>> {
  return await api.delete(`/users/delete/${id}`);
}

/**
 * Ativar/Desativar usuário
 */
export async function activateInactiveUserService(
  id: string,
  data: ActivateInactiveUserRequest
): Promise<AxiosResponse<ActivateInactiveUserResponse>> {
  return await api.put(`/users/activate-and-inactive/${id}`, data);
}

/**
 * Informar código do indicador (após cadastro)
 */
export async function updateReferrerService(
  data: UpdateReferrerRequest
): Promise<AxiosResponse<UpdateReferrerResponse>> {
  return await api.put("/users/referrer", data);
}

/**
 * Listar usuários convidados pelo usuário logado (GET /users/my-invited)
 */
export async function getMyInvitedUsersService(): Promise<AxiosResponse<ListInvitedUsersResponse>> {
  return await api.get("/users/my-invited");
}

/**
 * Listar usuários convidados por um indicador - para admin (pelo ID do usuário)
 */
export async function getInvitedUsersService(id: string): Promise<AxiosResponse<ListInvitedUsersResponse>> {
  return await api.get(`/users/${id}/invited`);
}
