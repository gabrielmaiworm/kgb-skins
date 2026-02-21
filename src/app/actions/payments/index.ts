"use server";

import { RefoundPaymentResponse } from "@/@types/payments";
import { refoundPaymentService } from "@/services/payments";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function refoundPaymentAction(paymentId: string): Promise<PostAndPutActionProps<RefoundPaymentResponse>> {
  try {
    const response = await refoundPaymentService(paymentId);
    return {
      message: "Pagamento estornado com sucesso!",
      success: true,
      responseData: response.data,
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao estornar pagamento", false, false);
    return {
      message: errorMessage,
      success: false,
    };
  }
}
