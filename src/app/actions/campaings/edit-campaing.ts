"use server";

import { UpdateCampaignResponse } from "@/@types/campaings";
import { updateCampaignService } from "@/services/campaigns";
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

export async function updateCampaignAction(
  prevState: PostAndPutActionProps<UpdateCampaignResponse>,
  data: FormData
): Promise<PostAndPutActionProps<UpdateCampaignResponse>> {
  try {
    // Extrair apenas o que precisa de processamento
    const itemFloat = data.get("itemFloat") as string;
    const itemCondition = getItemConditionFromFloat(parseFloat(itemFloat));
    const images = data.getAll("images") as File[];
    const id = data.get("id") as string;
    const isFree = data.get("is_free") === "true";

    if (!images || images.length === 0) {
      throw new Error("É necessário enviar ao menos uma imagem.");
    }

    const formDataToSend = new FormData();

    // Processar preços com base no isFree
    const itemPriceRaw = data.get("itemPrice") as string;
    const itemPrice = isFree ? "0" : parseFormattedPrice(itemPriceRaw);
    const maintenancePrice = isFree ? "0" : (data.get("maintenancePrice") as string);

    // Campos obrigatórios (description = subtitle)
    const subtitle = data.get("subtitle") as string;
    const description = subtitle || (data.get("title") as string);
    formDataToSend.append("title", data.get("title") as string);
    formDataToSend.append("description", description);
    formDataToSend.append("totalTickets", data.get("totalTickets") as string);
    formDataToSend.append("itemPrice", itemPrice);
    formDataToSend.append("maintenancePrice", maintenancePrice);
    formDataToSend.append("itemCondition", itemCondition);
    formDataToSend.append("itemFloat", itemFloat);
    formDataToSend.append("drawDate", data.get("drawDate") as string);
    if (isFree) formDataToSend.append("isFree", "true");
    formDataToSend.append("mode", "MANUAL");
    formDataToSend.append("featured", data.get("featured") === "true" ? "true" : "false");
    formDataToSend.append("coverImage", images[0]);

    // Campos opcionais
    if (subtitle) formDataToSend.append("subtitle", subtitle);

    const winnerTicket = data.get("winnerTicket");
    if (winnerTicket) formDataToSend.append("winnerTicket", winnerTicket as string);

    const prizeDescription = data.get("prizeDescription");
    if (prizeDescription) formDataToSend.append("prizeDescription", prizeDescription as string);

    const rules = data.get("rules");
    if (rules) formDataToSend.append("rules", rules as string);

    const status = data.get("status");
    if (status) formDataToSend.append("status", status as string);

    if (images.length > 1) {
      for (let i = 1; i < images.length; i++) {
        formDataToSend.append("gallery", images[i]);
      }
    }

    const response = await updateCampaignService(id, formDataToSend);
    return {
      message: "Campanha editada com sucesso!",
      success: true,
      responseData: response.data,
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao editar campanha");
    return {
      message: errorMessage,
      success: false,
    };
  }
}
