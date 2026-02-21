"use server";

import { deleteCampaignService } from "@/services/campaigns";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function deleteCampaignAction(id: string): Promise<PostAndPutActionProps<void>> {
  try {
    await deleteCampaignService(id);
    return {
      message: "Campanha deletada com sucesso!",
      success: true,
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao deletar campanha");
    return {
      message: errorMessage,
      success: false,
    };
  }
}
