// Campaigns Service Types

// Create Campaign
export interface CreateCampaignRequest {
  title: string;
  description: string;
  totalTickets: number;
  drawDate: string;
  coverImage?: File;
  coverImageUrl?: string;
  galleryImages?: File[];
  galleryUrls?: string[];
  prizeDescription?: string;
  rules?: string;
  status?: "PENDING" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELED";
  featured?: boolean;
  skinOwner?: string;
  inspectionLink?: string;
}

export interface CreateCampaignResponse {}

// List Campaigns
export interface ListCampaignsRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export type CampaignStatus = "PENDING" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELED";

export type CampaignMode = "MANUAL" | "RANDOM";

export interface CampaignListItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage?: string;
  gallery: string[];
  itemPrice: number;
  totalTickets: number;
  pricePerTicket: number;
  maintenancePrice: number;
  itemCondition: string;
  itemFloat: string;
  status: CampaignStatus;
  drawDate: string;
  mode: CampaignMode;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
  winnerTicket?: number;
  winner?: {
    name: string;
    phone: string;
  };
  paidTicketsCount: number;
  firstPurchaseAt?: string;
  lastPurchaseAt?: string;
  inspectionLink?: string;
  skinOwner?: string;
}

export interface ListCampaignsResponse {
  items: CampaignListItem[];
  totalPages: number;
  page: number;
  totalItems: number;
  itemsPerPage: number;
}

// Get Campaign By ID (pode incluir campos extras em relação ao list)
export interface GetCampaignByIdResponse extends CampaignListItem {
  featured?: boolean;
  prizeDescription?: string;
  rules?: string;
}

// Update Campaign
export interface UpdateCampaignRequest {
  title?: string;
  description?: string;
  totalTickets?: number;
  ticketPrice?: number;
  drawDate?: string;
  coverImage?: File;
  coverImageUrl?: string;
  galleryImages?: File[];
  galleryUrls?: string[];
  prizeDescription?: string;
  rules?: string;
  status?: "PENDING" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELED";
  featured?: boolean;
  skinOwner?: string;
  inspectionLink?: string;
}

export interface UpdateCampaignResponse {}

// Buy Tickets (Manual Mode)
export interface BuyTicketsManualRequest {
  numbers: number[];
}

export interface BuyTicketsManualResponse {
  tickets: {
    id: string;
    number: number;
    userId: string;
    status: string;
    campaignId: string;
    reservationExpiresAt?: string;
    createdAt: string;
    updatedAt: string;
  }[];
  payment?: {
    id: string;
    chargeId: string;
    amount: number;
    pixCopyPaste: string;
    qrCode: string;
    status: string;
    expiresAt: string;
  };
}

// Buy Tickets (Random Mode)
export interface BuyTicketsRandomRequest {
  quantity: number;
}

export interface BuyTicketsRandomResponse {}

// Confirm Payment
export interface ConfirmPaymentRequest {
  ticketIds: string[];
}

export interface ConfirmPaymentResponse {}

// My Orders
export interface MyOrdersRequest {
  page?: number;
  limit?: number;
}

export interface MyOrderCampaign {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  gallery: string[];
  itemPrice: number;
  totalTickets: number;
  pricePerTicket: number;
  maintenancePrice: number;
  itemCondition: string;
  itemFloat: string;
  status: CampaignStatus;
  drawDate: string;
  mode: CampaignMode;
  winnerTicket?: number;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MyOrderPayment {
  id: string;
  chargeId: string;
  userId: string;
  campaignId: string;
  amount: number;
  pixCopyPaste: string;
  qrCode: string;
  status: PaymentStatus;
  expiresAt: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyOrder {
  paymentId: string;
  numbers: number[];
  status: TicketStatus;
  campaign: MyOrderCampaign;
  payment: MyOrderPayment;
  createdAt: string;
  updatedAt: string;
}

export interface MyTicket {
  paymentId: string;
  numbers: number[];
  status: TicketStatus;
  campaign: MyOrderCampaign;
  payment: MyOrderPayment;
  createdAt: string;
  updatedAt: string;
}

export interface MyOrdersResponse {
  orders: MyOrder[];
  tickets: MyTicket[];
  total: number;
  page: number;
  limit: number;
}

// Pedidos por usuário (admin)
export interface GetUserOrdersRequest {
  page?: number;
  limit?: number;
}

export type GetUserOrdersResponse = MyOrdersResponse;

// Get Campaign Orders (Admin)
export interface GetCampaignOrdersRequest {
  status?: string;
}

export type TicketStatus = "RESERVED" | "PAID";

export type PaymentStatus = "PENDING" | "CONFIRMED" | "PAID" | "EXPIRED" | "FAILED";

export interface OrderUser {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderPayment {
  id: string;
  chargeId: string;
  userId: string;
  campaignId: string;
  amount: number;
  pixCopyPaste: string;
  qrCode: string;
  status: PaymentStatus;
  expiresAt: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignOrder {
  id: string;
  number: number;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignOrderAdmin extends CampaignOrder {
  user: OrderUser;
  payment: OrderPayment;
}

/** Pedido agrupado por pagamento (vários tickets na mesma compra = 1 linha) */
export interface GroupedOrderAdmin {
  id: string;
  numbers: number[];
  ticketIds: string[];
  user?: OrderUser;
  payment?: OrderPayment;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetCampaignOrdersResponse {
  orders: CampaignOrder[];
  total: number;
}

export interface GetCampaignOrdersAdminResponse {
  orders: CampaignOrderAdmin[];
  total: number;
}
