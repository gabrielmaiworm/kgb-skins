import { z } from "zod";

export const editUserSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({ required_error: "O nome é obrigatório" })
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(150, { message: "O nome não pode ter mais de 150 caracteres" }),
  email: z
    .string({ required_error: "O e-mail é obrigatório" })
    .email({ message: "Digite um e-mail válido" }),
  phone: z
    .string()
    .max(20, { message: "O telefone não pode ter mais de 20 caracteres" })
    .optional()
    .or(z.literal("")),
});

export type EditUserFormDataType = z.infer<typeof editUserSchema>;
