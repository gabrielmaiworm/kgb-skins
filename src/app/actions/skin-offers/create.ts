"use server";

import { CreateSkinOfferRequest, CreateSkinOfferResponse } from "@/@types/skin-offers";
import { createSkinOfferService } from "@/services/skin-offers";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function createSkinOfferAction(
  data: CreateSkinOfferRequest
): Promise<PostAndPutActionProps<CreateSkinOfferResponse>> {
  try {
    const response = await createSkinOfferService(data);
    return {
      message: "Oferta enviada com sucesso! Aguarde a resposta do administrador.",
      success: true,
      responseData: response.data,
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao enviar oferta");
    return {
      message: errorMessage,
      success: false,
      responseData: undefined,
    };
  }
}
