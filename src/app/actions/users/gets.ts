"use server";

import {
  listUsersService,
  findUserByIdService,
  getMyInvitedUsersService,
  getInvitedUsersService,
  getTopInvitersService,
  getBestBuyersService,
} from "@/services/users";
import { baseGetAction } from "../base-get-actions";
import { axiosErrorMessage } from "@/utils/errorMessage";
import {
  ListUsersRequest,
  ListUsersResponse,
  FindUserByIdResponse,
  ListInvitedUsersResponse,
  TopInvitersRequest,
  TopInvitersResponse,
  BestBuyersRequest,
  BestBuyersResponse,
} from "@/@types/users";

export const listUsersAction = baseGetAction<ListUsersRequest, ListUsersResponse>(
  listUsersService,
  "Lista de usuários obtida com sucesso.",
  "Erro ao obter lista de usuários."
);

export const findUserByIdAction = baseGetAction<string, FindUserByIdResponse>(
  findUserByIdService,
  "Usuário obtido com sucesso.",
  "Erro ao obter usuário."
);

export async function getMyInvitedUsersAction() {
  try {
    const response = await getMyInvitedUsersService();
    return {
      message: "Usuários convidados obtidos com sucesso.",
      success: true,
      issues: [] as string[],
      responseData: response.data,
    };
  } catch (error) {
    const errorMsg = await axiosErrorMessage(error, "Erro ao obter usuários convidados");
    return {
      message: errorMsg,
      success: false,
      issues: [errorMsg],
      responseData: undefined,
    };
  }
}

export const getInvitedUsersAction = baseGetAction<string, ListInvitedUsersResponse>(
  getInvitedUsersService,
  "Usuários convidados obtidos com sucesso.",
  "Erro ao obter usuários convidados."
);

export const getTopInvitersAction = baseGetAction<TopInvitersRequest, TopInvitersResponse>(
  getTopInvitersService,
  "Top convidadores obtidos com sucesso.",
  "Erro ao obter top convidadores."
);

export const getBestBuyersAction = baseGetAction<BestBuyersRequest, BestBuyersResponse>(
  getBestBuyersService,
  "Maiores compradores obtidos com sucesso.",
  "Erro ao obter maiores compradores."
);
