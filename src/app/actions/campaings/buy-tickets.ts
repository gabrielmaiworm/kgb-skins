"use server";

import { BuyTicketsManualRequest, BuyTicketsManualResponse } from "@/@types/campaings";
import { buyTicketsManualService } from "@/services/campaigns";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function buyTicketsManualAction(data: {
  companyId: string;
  numbers: number[];
}): Promise<PostAndPutActionProps<BuyTicketsManualResponse>> {
  try {
    const campaignId = data.companyId as string;
    const payload: BuyTicketsManualRequest = {
      numbers: Array.isArray(data.numbers) ? data.numbers.map(Number) : data.numbers ? [Number(data.numbers)] : [],
    };

    const response = await buyTicketsManualService(campaignId, payload);
    return {
      message: "Campanha criada com sucesso!",
      success: true,
      responseData: response.data,
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao comprar tickets.");
    return {
      message: errorMessage,
      success: false,
    };
  }
}
