// Payments Service Types

// Webhook EFI
export interface WebhookEFIRequest {
  pix: Array<{
    endToEndId: string;
    txid: string;
    chave: string;
    valor: string;
    horario: string;
    infoPagador: string;
  }>;
}

export interface WebhookEFIResponse {}

export interface RefoundPaymentResponse {
  id: string;
  chargeId: string;
  userId: string;
  campaignId: string;
  amount: number;
  pixCopyPaste: string;
  qrCode: string;
  status: string;
  expiresAt: string;
  paidAt: string;
  endToEndId: string;
  refundedAt: string;
  refundId: string;
  refundRtrId: string;
  refundStatus: string;
  createdAt: string;
  updatedAt: string;
}
