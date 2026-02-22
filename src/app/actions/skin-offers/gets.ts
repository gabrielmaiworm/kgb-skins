"use server";

import {
  listSkinOffersAdminService,
  listMySkinOffersService,
} from "@/services/skin-offers";
import { baseGetAction } from "../base-get-actions";
import {
  ListSkinOffersAdminRequest,
  ListSkinOffersAdminResponse,
  ListMySkinOffersResponse,
} from "@/@types/skin-offers";

export const listSkinOffersAdminAction = baseGetAction<
  ListSkinOffersAdminRequest,
  ListSkinOffersAdminResponse
>(
  listSkinOffersAdminService,
  "Lista de ofertas obtida com sucesso.",
  "Erro ao obter lista de ofertas."
);

export async function listMySkinOffersAction(): Promise<GetActionProps<ListMySkinOffersResponse>> {
  try {
    const response = await listMySkinOffersService();
    return {
      message: "Suas ofertas obtidas com sucesso.",
      success: true,
      responseData: response.data,
    };
  } catch (error) {
    const { axiosErrorMessage } = await import("@/utils/errorMessage");
    const errorMsg = await axiosErrorMessage(error, "Erro ao obter suas ofertas");
    return {
      message: errorMsg,
      success: false,
      responseData: undefined,
    };
  }
}
