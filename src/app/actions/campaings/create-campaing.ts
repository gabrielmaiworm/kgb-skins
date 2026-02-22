"use server";

import { CreateCampaignRequest, CreateCampaignResponse } from "@/@types/campaings";
import { createCampaignService } from "@/services/campaigns";
import { axiosErrorMessage } from "@/utils/errorMessage";
import { parseFormattedPrice } from "@/utils/input-masks";

// Função para calcular itemCondition baseado no float
function getItemConditionFromFloat(floatValue: number): string {
  if (floatValue >= 0 && floatValue <= 0.07) return "Factory New";
  if (floatValue > 0.07 && floatValue <= 0.15) return "Minimal Wear";
  if (floatValue > 0.15 && floatValue <= 0.37) return "Field-Tested";
  if (floatValue > 0.37 && floatValue <= 0.44) return "Well-Worn";
  if (floatValue > 0.44 && floatValue <= 1.0) return "Battle-Scarred";
  return "Factory New"; // Default
}

export async function postCreateCampaignAction(
  prevState: PostAndPutActionProps<CreateCampaignResponse>,
  data: FormData
): Promise<PostAndPutActionProps<CreateCampaignResponse>> {
  try {
    const title = data.get("title") as string;
    const subtitle = data.get("subtitle") as string;
    const description = subtitle || title; // Usa o subtítulo como descrição
    const totalTickets = data.get("totalTickets") as string;
    const isFree = data.get("is_free") === "true";

    // Se for free, definir preços como 0
    const itemPriceRaw = data.get("itemPrice") as string;
    const itemPrice = isFree ? "0" : parseFormattedPrice(itemPriceRaw);
    const maintenancePrice = isFree ? "0" : (data.get("maintenancePrice") as string);

    const itemFloat = data.get("itemFloat") as string;
    const drawDate = data.get("drawDate") as string;
    const prizeDescription = data.get("prizeDescription") as string;
    const rules = data.get("rules") as string;
    const status = data.get("status") as string;
    const featured = data.get("featured") === "true";

    // Calcular itemCondition baseado no float
    const floatValue = parseFloat(itemFloat);
    const itemCondition = getItemConditionFromFloat(floatValue);

    // Modo fixo como MANUAL
    const mode = "MANUAL";

    const coverImage = data.get("coverImage");
    const gallery = data.getAll("gallery");

    if (!coverImage) {
      throw new Error("É necessário enviar ao menos uma imagem.");
    }

    const formDataToSend = new FormData();

    formDataToSend.append("title", title);
    if (subtitle) formDataToSend.append("subtitle", subtitle);
    formDataToSend.append("description", description);
    formDataToSend.append("totalTickets", totalTickets);
    formDataToSend.append("itemPrice", itemPrice);
    formDataToSend.append("maintenancePrice", maintenancePrice);
    formDataToSend.append("itemCondition", itemCondition);
    formDataToSend.append("itemFloat", itemFloat);
    formDataToSend.append("drawDate", drawDate);
    if (isFree) formDataToSend.append("isFree", "true");
    if (prizeDescription) formDataToSend.append("prizeDescription", prizeDescription);
    if (rules) formDataToSend.append("rules", rules);
    if (status) formDataToSend.append("status", status);
    if (mode) formDataToSend.append("mode", mode);
    formDataToSend.append("featured", featured.toString());

    const skinOwner = data.get("skinOwner") as string;
    if (skinOwner) formDataToSend.append("skinOwner", skinOwner);

    const inspectionLink = (data.get("inspectionLink") as string)?.trim();
    if (inspectionLink) formDataToSend.append("inspectionLink", inspectionLink);

    formDataToSend.append("coverImage", coverImage);

    gallery.forEach((file) => formDataToSend.append("gallery", file));

    const response = await createCampaignService(formDataToSend);
    return {
      message: "Campanha criada com sucesso!",
      success: true,
      responseData: response.data,
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao criar campanha");
    return {
      message: errorMessage,
      success: false,
    };
  }
}
