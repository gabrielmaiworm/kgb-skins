import { AxiosResponse } from "axios";
import api from "../axiosNodeApi";
import { RefoundPaymentResponse, WebhookEFIRequest, WebhookEFIResponse } from "../../@types/payments";

/**
 * Webhook para receber notificações de pagamento da EFI
 * Nota: Este endpoint geralmente é chamado pelo servidor EFI, não pelo cliente
 */
export async function webhookEFIService(data: WebhookEFIRequest): Promise<AxiosResponse<WebhookEFIResponse>> {
  return await api.post("/payments/webhook", data);
}

export async function refoundPaymentService(paymentId: string): Promise<AxiosResponse<RefoundPaymentResponse>> {
  return await api.post(`/payments/${paymentId}/refund`);
}
