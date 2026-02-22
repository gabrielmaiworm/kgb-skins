"use server";

import { UpdateCampaignResponse } from "@/@types/campaings";
import { PostAndPutActionProps } from "@/@types/kikito-action";
import { getCampaignByIdService, updateCampaignService } from "@/services/campaigns";
import { axiosErrorMessage } from "@/utils/errorMessage";

async function fetchImageAsFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Falha ao buscar imagem: ${url}`);
  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/jpeg";
  const blob = new Blob([arrayBuffer], { type: contentType });
  return new File([blob], filename, { type: contentType });
}

export async function updateCampaignWinnerAction(
  campaignId: string,
  winnerTicket: number
): Promise<PostAndPutActionProps<UpdateCampaignResponse>> {
  try {
    const campaignResponse = await getCampaignByIdService(campaignId);
    const campaign = campaignResponse.data;

    if (!campaign) {
      throw new Error("Campanha não encontrada.");
    }

    const { coverImage, gallery } = campaign;
    const imageUrls = [coverImage, ...(gallery || [])].filter(Boolean) as string[];

    if (imageUrls.length === 0) {
      throw new Error("Campanha sem imagens.");
    }

    const imageFiles = await Promise.all(
      imageUrls.map((url, i) =>
        fetchImageAsFile(url, i === 0 ? "cover.jpg" : `gallery-${i}.jpg`)
      )
    );

    const formData = new FormData();
    formData.append("id", campaignId);
    formData.append("title", campaign.title);
    formData.append("subtitle", campaign.subtitle || "");
    formData.append("description", campaign.description || "");
    formData.append("totalTickets", String(campaign.totalTickets));
    formData.append(
      "itemPrice",
      campaign.isFree ? "0" : String(campaign.itemPrice)
    );
    formData.append(
      "maintenancePrice",
      campaign.isFree ? "0" : String(campaign.maintenancePrice)
    );
    formData.append("itemCondition", campaign.itemCondition || "");
    formData.append("itemFloat", campaign.itemFloat || "0");
    formData.append("drawDate", new Date().toISOString());
    formData.append("is_free", campaign.isFree ? "true" : "false");
    formData.append("mode", campaign.mode || "MANUAL");
    if (campaign.featured !== undefined) {
      formData.append("featured", String(campaign.featured));
    }
    formData.append("winnerTicket", String(winnerTicket));
    formData.append("status", "COMPLETED"); // Ao definir vencedor, marca campanha como concluída

    if (campaign.prizeDescription) {
      formData.append("prizeDescription", campaign.prizeDescription);
    }
    if (campaign.rules) {
      formData.append("rules", campaign.rules);
    }

    formData.append("coverImage", imageFiles[0]);
    for (let i = 1; i < imageFiles.length; i++) {
      formData.append("gallery", imageFiles[i]);
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
