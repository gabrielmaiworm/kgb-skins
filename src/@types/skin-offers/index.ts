// Skin Offers Types

export type SkinOfferStatus = "AWAITING_RESPONSE" | "PENDING" | "DENIED" | "COMPLETED";

export interface SkinOfferListItem {
  id: string;
  inspectLink: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  offeredAmount: number | null;
  status: SkinOfferStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface SkinOfferItem {
  id: string;
  inspectLink: string;
  status: SkinOfferStatus;
  createdAt: string;
}

// Create
export interface CreateSkinOfferRequest {
  inspectLink: string;
}

export interface CreateSkinOfferResponse {
  id: string;
  inspectLink: string;
  status: SkinOfferStatus;
  createdAt: string;
}

// List Admin
export interface ListSkinOffersAdminRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: SkinOfferStatus;
}

export interface ListSkinOffersAdminResponse {
  items: SkinOfferListItem[];
  totalPages: number;
  page: number;
  totalItems: number;
  itemsPerPage: number;
}

// List My Offers
export interface ListMySkinOffersResponse {
  items: SkinOfferItem[];
  totalPages: number;
  page: number;
  totalItems: number;
  itemsPerPage: number;
}

// Conclude
export interface ConcludeSkinOfferRequest {
  balanceAmount: number;
  pendingDays: number;
}
