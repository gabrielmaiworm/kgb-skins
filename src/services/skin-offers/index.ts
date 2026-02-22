import { AxiosResponse } from "axios";
import api from "../axiosNodeApi";
import {
  CreateSkinOfferRequest,
  CreateSkinOfferResponse,
  ListSkinOffersAdminRequest,
  ListSkinOffersAdminResponse,
  ListMySkinOffersResponse,
  SkinOfferListItem,
  SkinOfferItem,
  ConcludeSkinOfferRequest,
} from "@/@types/skin-offers";

const isMockEnabled = () => process.env.NEXT_PUBLIC_MOCK_SKIN_OFFERS === "true";

const MOCK_OFFERS: SkinOfferListItem[] = [
  {
    id: "mock-1",
    inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198838334544A49699241350D17186301390446800211",
    userId: "user-1",
    userName: "João Silva",
    userEmail: "joao@email.com",
    userPhone: "11999999999",
    offeredAmount: null,
    status: "AWAITING_RESPONSE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-2",
    inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198838334544A49699241350D17186301390446800211",
    userId: "user-2",
    userName: "Maria Santos",
    userEmail: "maria@email.com",
    userPhone: "11988888888",
    offeredAmount: 150.5,
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "mock-3",
    inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198838334544A49699241350D17186301390446800211",
    userId: "user-3",
    userName: "Pedro Costa",
    userEmail: "pedro@email.com",
    userPhone: "11977777777",
    offeredAmount: null,
    status: "PENDING",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const MOCK_MY_OFFERS: SkinOfferItem[] = [
  {
    id: "mock-1",
    inspectLink: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198838334544A49699241350D17186301390446800211",
    status: "AWAITING_RESPONSE",
    createdAt: new Date().toISOString(),
  },
];

export async function createSkinOfferService(
  data: CreateSkinOfferRequest
): Promise<AxiosResponse<CreateSkinOfferResponse>> {
  if (isMockEnabled()) {
    const mock: CreateSkinOfferResponse = {
      id: "mock-new",
      inspectLink: data.inspectLink,
      status: "AWAITING_RESPONSE",
      createdAt: new Date().toISOString(),
    };
    return Promise.resolve({ data: mock } as AxiosResponse<CreateSkinOfferResponse>);
  }
  return api.post<CreateSkinOfferResponse>("/skin-offers", data);
}

export async function listSkinOffersAdminService(
  params?: ListSkinOffersAdminRequest
): Promise<AxiosResponse<ListSkinOffersAdminResponse>> {
  if (isMockEnabled()) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const mockResponse: ListSkinOffersAdminResponse = {
      items: MOCK_OFFERS,
      page,
      totalPages: 1,
      totalItems: MOCK_OFFERS.length,
      itemsPerPage: limit,
    };
    return Promise.resolve({ data: mockResponse } as AxiosResponse<ListSkinOffersAdminResponse>);
  }
  return api.get<ListSkinOffersAdminResponse>("/skin-offers/admin", { params });
}

export async function listMySkinOffersService(): Promise<AxiosResponse<ListMySkinOffersResponse>> {
  if (isMockEnabled()) {
    const mockResponse: ListMySkinOffersResponse = {
      items: MOCK_MY_OFFERS,
      page: 1,
      totalPages: 1,
      totalItems: MOCK_MY_OFFERS.length,
      itemsPerPage: 10,
    };
    return Promise.resolve({ data: mockResponse } as AxiosResponse<ListMySkinOffersResponse>);
  }
  return api.get<ListMySkinOffersResponse>("/skin-offers/me");
}

export async function acceptSkinOfferService(id: string): Promise<AxiosResponse<SkinOfferListItem>> {
  if (isMockEnabled()) {
    const updated = { ...MOCK_OFFERS[0], id, status: "PENDING" as const };
    return Promise.resolve({ data: updated } as AxiosResponse<SkinOfferListItem>);
  }
  return api.patch<SkinOfferListItem>(`/skin-offers/${id}/accept`);
}

export async function denySkinOfferService(id: string): Promise<AxiosResponse<SkinOfferListItem>> {
  if (isMockEnabled()) {
    const updated = { ...MOCK_OFFERS[0], id, status: "DENIED" as const };
    return Promise.resolve({ data: updated } as AxiosResponse<SkinOfferListItem>);
  }
  return api.patch<SkinOfferListItem>(`/skin-offers/${id}/deny`);
}

export async function concludeSkinOfferService(
  id: string,
  data: ConcludeSkinOfferRequest
): Promise<AxiosResponse<SkinOfferListItem>> {
  if (isMockEnabled()) {
    const updated: SkinOfferListItem = {
      ...MOCK_OFFERS[0],
      id,
      offeredAmount: data.balanceAmount,
      status: "COMPLETED",
    };
    return Promise.resolve({ data: updated } as AxiosResponse<SkinOfferListItem>);
  }
  return api.patch<SkinOfferListItem>(`/skin-offers/${id}/conclude`, data);
}
