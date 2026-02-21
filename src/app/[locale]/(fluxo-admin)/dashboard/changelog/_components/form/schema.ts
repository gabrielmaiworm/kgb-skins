import { z } from "zod";

export const schema = z.object({
  date: z
    .string({ required_error: "A data é obrigatória" })
    .min(1, { message: "A data é obrigatória" }),
  title: z
    .string({ required_error: "O título é obrigatório" })
    .min(3, { message: "O título deve ter pelo menos 3 caracteres" })
    .max(200, { message: "O título não pode ter mais de 200 caracteres" }),
  description: z
    .string({ required_error: "A descrição é obrigatória" })
    .min(10, { message: "A descrição deve ter pelo menos 10 caracteres" })
    .max(2000, { message: "A descrição não pode ter mais de 2000 caracteres" }),
  type: z.enum(["SUPPORT", "FEATURE", "BUGFIX"], {
    required_error: "Selecione o tipo",
  }),
});

export type FormDataType = z.infer<typeof schema>;
