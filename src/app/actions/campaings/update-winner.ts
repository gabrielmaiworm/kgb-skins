"use server";

import { UpdateCampaignResponse } from "@/@types/campaings";
import { PostAndPutActionProps } from "@/@types/kikito-action";
import { updateCampaignService } from "@/services/campaigns";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function updateCampaignWinnerWithFormDataAction(
  formData: FormData
): Promise<PostAndPutActionProps<UpdateCampaignResponse>> {
  try {
    const campaignId = formData.get("id") as string;
    if (!campaignId) {
      throw new Error("ID da campanha não informado.");
    }

    const response = await updateCampaignService(campaignId, formData);
    return {
      message: "Número vencedor definido com sucesso!",
      success: true,
      responseData: response.data,
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(
      error,
      "Erro ao definir número vencedor"
    );
    return {
      message: errorMessage,
      success: false,
    };
  }
}
