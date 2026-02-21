"use server";

import { updateReferrerService } from "@/services/users";
import { axiosErrorMessage } from "@/utils/errorMessage";
import { UpdateReferrerRequest, UpdateReferrerResponse } from "@/@types/users";
import { PostAndPutActionProps } from "@/@types/kikito-action";

export async function updateReferrerAction(
  data: UpdateReferrerRequest
): Promise<PostAndPutActionProps<UpdateReferrerResponse>> {
  try {
    if (!data.inviteCode?.trim()) {
      return {
        message: "Código do indicador é obrigatório.",
        success: false,
      };
    }

    await updateReferrerService({ inviteCode: data.inviteCode.trim() });

    return {
      message: "Indicador vinculado com sucesso!",
      success: true,
    };
  } catch (error: unknown) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao vincular indicador");
    return {
      message: errorMessage,
      success: false,
    };
  }
}
