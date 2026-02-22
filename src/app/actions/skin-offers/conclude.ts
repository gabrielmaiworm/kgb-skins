"use server";

import { SkinOfferListItem, ConcludeSkinOfferRequest } from "@/@types/skin-offers";
import { concludeSkinOfferService } from "@/services/skin-offers";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function concludeSkinOfferAction(
  id: string,
  data: ConcludeSkinOfferRequest
): Promise<PostAndPutActionProps<SkinOfferListItem>> {
  try {
    const response = await concludeSkinOfferService(id, data);
    return {
      message: "Oferta concluída. Saldo creditado ao usuário.",
      success: true,
      responseData: response.data,
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao concluir oferta");
    return {
      message: errorMessage,
      success: false,
      responseData: undefined,
    };
  }
}
