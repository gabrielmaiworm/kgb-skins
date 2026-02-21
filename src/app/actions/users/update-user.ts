"use server";

import { updateUserService } from "@/services/users";
import { axiosErrorMessage } from "@/utils/errorMessage";
import { UpdateUserResponse } from "@/@types/users";
import { PostAndPutActionProps } from "@/@types/kikito-action";

export async function updateUserAction(
  prevState: PostAndPutActionProps<UpdateUserResponse>,
  data: FormData
): Promise<PostAndPutActionProps<UpdateUserResponse>> {
  try {
    const id = data.get("id") as string;
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const phone = (data.get("phone") as string) || undefined;

    if (!id) {
      throw new Error("ID do usuário é obrigatório.");
    }

    const response = await updateUserService(id, {
      name: name || undefined,
      email: email || undefined,
      phone,
    });

    return {
      message: "Usuário atualizado com sucesso!",
      success: true,
      responseData: response.data,
    };
  } catch (error: unknown) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao atualizar usuário");
    return {
      message: errorMessage,
      success: false,
    };
  }
}
