import { AxiosResponse } from "axios";
import api from "../axiosNodeApi";
import {
  CreateCampaignRequest,
  CreateCampaignResponse,
  ListCampaignsRequest,
  ListCampaignsResponse,
  GetCampaignByIdResponse,
  UpdateCampaignRequest,
  UpdateCampaignResponse,
  BuyTicketsManualRequest,
  BuyTicketsManualResponse,
  BuyTicketsRandomRequest,
  BuyTicketsRandomResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  MyOrdersRequest,
  MyOrdersResponse,
  GetCampaignOrdersRequest,
  GetCampaignOrdersResponse,
  GetCampaignOrdersAdminResponse,
} from "@/@types/campaings";

/**
 * Criar campanha (suporta files e URLs)
 */
export async function createCampaignService(data: FormData): Promise<AxiosResponse<CreateCampaignResponse>> {
  return await api.post("/campaigns", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * Listar campanhas com paginação e filtros
 */
export async function listCampaignsService(
  params?: ListCampaignsRequest
): Promise<AxiosResponse<ListCampaignsResponse>> {
  return await api.get("/campaigns", { params });
}

/**
 * Buscar campanha por ID
 */
export async function getCampaignByIdService(id: string): Promise<AxiosResponse<GetCampaignByIdResponse>> {
  return await api.get(`/campaigns/${id}`);
}

/**
 * Atualizar campanha (suporta files e URLs)
 */
export async function updateCampaignService(
  id: string,
  data: UpdateCampaignRequest | FormData
): Promise<AxiosResponse<UpdateCampaignResponse>> {
  return await api.put(`/campaigns/${id}`, data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
}

/**
 * Comprar tickets - Modo Manual (números específicos)
 */
export async function buyTicketsManualService(
  campaignId: string,
  data: BuyTicketsManualRequest
): Promise<AxiosResponse<BuyTicketsManualResponse>> {
  return await api.post(`/campaigns/${campaignId}/buy-tickets`, data);
}

/**
 * Comprar tickets - Modo Aleatório (quantidade)
 */
export async function buyTicketsRandomService(
  campaignId: string,
  data: BuyTicketsRandomRequest
): Promise<AxiosResponse<BuyTicketsRandomResponse>> {
  return await api.post(`/campaigns/${campaignId}/buy-tickets`, data);
}

/**
 * Confirmar pagamento de tickets
 */
export async function confirmPaymentService(
  campaignId: string,
  data: ConfirmPaymentRequest
): Promise<AxiosResponse<ConfirmPaymentResponse>> {
  return await api.post(`/campaigns/${campaignId}/confirm-payment`, data);
}

/**
 * Histórico de tickets pagos do usuário autenticado
 */
export async function myOrdersService(params?: MyOrdersRequest): Promise<AxiosResponse<MyOrdersResponse>> {
  return await api.get("/campaigns/tickets/my-orders", { params });
}

/**
 * Listar pedidos de uma campanha (Admin)
 */
export async function getCampaignOrdersService(
  campaignId: string,
  params?: GetCampaignOrdersRequest
): Promise<AxiosResponse<GetCampaignOrdersResponse>> {
  return await api.get(`/campaigns/${campaignId}/orders`, { params });
}

export async function getCampaignOrdersAdminService(
  campaignId: string,
  params?: GetCampaignOrdersRequest
): Promise<AxiosResponse<GetCampaignOrdersAdminResponse>> {
  return await api.get(`/campaigns/admin/${campaignId}/orders`, { params });
}

/**
 * Deletar campanha
 */
export async function deleteCampaignService(id: string): Promise<AxiosResponse<void>> {
  return await api.delete(`/campaigns/${id}`);
}
