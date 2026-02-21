"use server";

import {
  getCampaignByIdService,
  getCampaignOrdersAdminService,
  getCampaignOrdersService,
  listCampaignsService,
  myOrdersService,
} from "@/services/campaigns";
import { baseGetAction } from "../base-get-actions";
import {
  ListCampaignsRequest,
  ListCampaignsResponse,
  GetCampaignByIdResponse,
  MyOrdersRequest,
  MyOrdersResponse,
  GetCampaignOrdersResponse,
  GetCampaignOrdersAdminResponse,
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
