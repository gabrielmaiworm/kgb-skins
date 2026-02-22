"use server";

import { SkinOfferListItem } from "@/@types/skin-offers";
import { acceptSkinOfferService } from "@/services/skin-offers";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function acceptSkinOfferAction(id: string): Promise<PostAndPutActionProps<SkinOfferListItem>> {
  try {
    const response = await acceptSkinOfferService(id);
    return {
      message: "Oferta aceita. Entre em contato com o cliente.",
      success: true,
      responseData: response.data,
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao aceitar oferta");
    return {
      message: errorMessage,
      success: false,
      responseData: undefined,
    };
  }
}
