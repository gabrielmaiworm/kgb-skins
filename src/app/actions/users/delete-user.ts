"use server";

import { deleteUserService } from "@/services/users";
import { axiosErrorMessage } from "@/utils/errorMessage";
import { PostAndPutActionProps } from "@/@types/kikito-action";

export async function deleteUserAction(id: string): Promise<PostAndPutActionProps<void>> {
  try {
    await deleteUserService(id);
    return {
      message: "Usuário deletado com sucesso!",
      success: true,
    };
  } catch (error: unknown) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao deletar usuário");
    return {
      message: errorMessage,
      success: false,
    };
  }
}
