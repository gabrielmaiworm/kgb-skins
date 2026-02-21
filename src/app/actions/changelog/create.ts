"use server";

import { CreateChangelogRequest, ChangelogType, CreateChangelogResponse } from "@/@types/changelog";
import { createChangelogService } from "@/services/changelog";
import { axiosErrorMessage } from "@/utils/errorMessage";

function toIsoDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();
  if (dateStr.includes("T")) return dateStr;
  return `${dateStr}T00:00:00.000Z`;
}

export async function createChangelogAction(
  prevState: PostAndPutActionProps<CreateChangelogResponse>,
  data: FormData
): Promise<PostAndPutActionProps<CreateChangelogResponse>> {
  try {
    const date = data.get("date") as string;
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const type = data.get("type") as ChangelogType;

    if (!title?.trim() || !description?.trim() || !type) {
      return {
        message: "Preencha todos os campos obrigatórios.",
        success: false,
      };
    }

    const payload: CreateChangelogRequest = {
      date: toIsoDate(date || new Date().toISOString().split("T")[0]),
      title: title.trim(),
      description: description.trim(),
      type: type as ChangelogType,
    };

    const response = await createChangelogService(payload);
    return {
      message: "Entrada do changelog criada com sucesso!",
      success: true,
      responseData: response.data,
    };
  } catch (error) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao criar entrada do changelog");
    return {
      message: errorMessage,
      success: false,
    };
  }
}
