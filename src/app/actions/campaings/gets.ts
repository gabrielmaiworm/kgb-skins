"use server";

import {
  getCampaignByIdService,
  getCampaignOrdersAdminService,
  getCampaignOrdersByUserIdService,
  getCampaignOrdersService,
  listCampaignsService,
  myOrdersService,
} from "@/services/campaigns";
import { axiosErrorMessage } from "@/utils/errorMessage";
import { baseGetAction } from "../base-get-actions";
import {
  ListCampaignsRequest,
  ListCampaignsResponse,
  GetCampaignByIdResponse,
  MyOrdersRequest,
  MyOrdersResponse,
  GetCampaignOrdersResponse,
  GetCampaignOrdersAdminResponse,
  GetUserOrdersRequest,
  GetUserOrdersResponse,
} from "@/@types/campaings";

export const listCampaingsAction = baseGetAction<ListCampaignsRequest, ListCampaignsResponse>(
  listCampaignsService,
  "Lista de campanhas obtida com sucesso.",
  "Erro ao obter lista de campanhas."
);

export const getCampaignByIdAction = baseGetAction<string, GetCampaignByIdResponse>(
  getCampaignByIdService,
  "Campanha obtida com sucesso.",
  "Erro ao obter campanha."
);

export const getCampaignOrdersAction = baseGetAction<string, GetCampaignOrdersResponse>(
  getCampaignOrdersService,
  "Pedidos da campanha obtidos com sucesso.",
  "Erro ao obter pedidos da campanha."
);

export const getCampaignOrdersAdminAction = baseGetAction<string, GetCampaignOrdersAdminResponse>(
  getCampaignOrdersAdminService,
  "Pedidos da campanha obtidos com sucesso.",
  "Erro ao obter pedidos da campanha."
);

export const getMyOrdersAction = baseGetAction<MyOrdersRequest, MyOrdersResponse>(
  myOrdersService,
  "Números obtidos com sucesso.",
  "Erro ao obter números."
);

export async function getCampaignOrdersByUserIdAction(
  userId: string,
  params?: GetUserOrdersRequest
): Promise<GetActionProps<GetUserOrdersResponse>> {
  try {
    const response = await getCampaignOrdersByUserIdService(userId, params);
    return {
      message: "Pedidos do usuário obtidos com sucesso.",
      success: true,
      issues: [],
      responseData: response.data,
    };
  } catch (error) {
    const errorMsg = await axiosErrorMessage(error, "Erro ao obter pedidos do usuário.");
    return {
      message: errorMsg,
      success: false,
      issues: [errorMsg],
      responseData: undefined,
    };
  }
}
