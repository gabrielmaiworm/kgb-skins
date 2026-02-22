"use server";

import { SkinOfferListItem } from "@/@types/skin-offers";
import { denySkinOfferService } from "@/services/skin-offers";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function denySkinOfferAction(id: string): Promise<PostAndPutActionProps<SkinOfferListItem>> {
  try {
    const response = await denySkinOfferService(id);
    return {
      message: "Oferta negada.",
      success: true,
      responseData: response.data,
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao negar oferta");
    return {
      message: errorMessage,
      success: false,
      responseData: undefined,
    };
  }
}
