"use server";

import { CreatePublicUserRequest, CreatePublicUserResponse } from "@/@types/users";
import { createPublicUserService } from "@/services/users";
import { axiosErrorMessage } from "@/utils/errorMessage";

export async function createPublicUserAction(
  prevState: PostAndPutActionProps<CreatePublicUserResponse>,
  data: FormData
): Promise<PostAndPutActionProps<CreatePublicUserResponse>> {
  try {
    const formData = Object.fromEntries(data.entries());

    const payload: CreatePublicUserRequest = {
      email: formData.email as string,
      name: formData.name as string,
      phone: formData.phone as string,
      ...(formData.referrerInviteCode && {
        referrerInviteCode: formData.referrerInviteCode as string,
      }),
    };

    const response = await createPublicUserService(payload);
    return {
      message: "Usuário público criado com sucesso!",
      success: true,
      responseData: response.data,
    };
  } catch (error: any) {
    const errorMessage = await axiosErrorMessage(error, "Erro ao criar usuário público", false, false);
    return {
      message: errorMessage,
      success: false,
    };
  }
}
