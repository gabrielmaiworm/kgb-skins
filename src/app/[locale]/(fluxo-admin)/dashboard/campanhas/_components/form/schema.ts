import { z } from "zod";

export const fileSchema = z.custom<File>((val) => val instanceof File, {
  message: "Arquivo obrigatório",
});

export const compaingImageSchema = z.object({
  image: z.string().max(5242880, "A imagem não pode exceder 5MB em formato base64").optional(),
  file: fileSchema.optional(), // Campo para armazenar o objeto File
  tempUrl: z.string().max(2048, "URL temporária muito longa").optional(), // URL temporária para visualização no cliente
});

// Schema para imagens com limites apropriados
const imageSchema = z.object({
  image: z.string().max(5242880, "A imagem não pode exceder 5MB em formato base64").optional(),
  file: z.any().optional(),
});

export const baseSchema = z.object({
  title: z
    .string({ required_error: "O título é obrigatório" })
    .min(3, { message: "O título deve ter pelo menos 3 caracteres" })
    .max(200, { message: "O título não pode ter mais de 200 caracteres" }),
  subtitle: z
    .string()
    .min(3, { message: "O subtítulo deve ter pelo menos 3 caracteres" })
    .max(200, { message: "O subtítulo não pode ter mais de 200 caracteres" })
    .optional(),
  description: z.string().optional(), // Enviado automaticamente com o mesmo valor do subtitle nas actions
  totalTickets: z
    .string({ required_error: "O total de tickets é obrigatório" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "O total de tickets deve ser um número maior que 0",
    }),
  itemPrice: z
    .string()
    .refine(
      (val) => {
        if (!val) return true; // Permite vazio (será validado pelo refine do schema)
        // Remove formatação (R$, pontos e vírgulas) e valida
        const cleanValue = val.replace(/[R$\s.]/g, "").replace(",", ".");
        return !isNaN(Number(cleanValue)) && Number(cleanValue) > 0;
      },
      {
        message: "O preço do item deve ser um número maior que 0",
      }
    )
    .optional(),
  maintenancePrice: z
    .string()
    .refine(
      (val) => {
        if (!val) return true; // Permite vazio (será validado pelo refine do schema)
        return !isNaN(Number(val)) && Number(val) >= 0;
      },
      {
        message: "O preço de manutenção deve ser um número maior ou igual a 0",
      }
    )
    .optional(),
  itemFloat: z
    .string({ required_error: "O float do item é obrigatório" })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 1, {
      message: "O float deve ser um número entre 0 e 1",
    }),
  drawDate: z
    .string({ required_error: "A data do sorteio é obrigatória" })
    .min(1, { message: "A data do sorteio é obrigatória" }),
  prizeDescription: z
    .string()
    .max(1000, { message: "A descrição do prêmio não pode ter mais de 1000 caracteres" })
    .optional(),
  rules: z.string().max(2000, { message: "As regras não podem ter mais de 2000 caracteres" }).optional(),
  status: z.enum(["PENDING", "ACTIVE", "PAUSED", "COMPLETED", "CANCELED"]).optional(),
  featured: z.boolean().optional(),
  images: z.array(imageSchema).max(10, { message: "No máximo 10 imagens são permitidas" }).optional(),
  is_free: z.boolean().optional(),
  skinOwner: z.string().optional(),
  inspectionLink: z.string().max(2048).optional(),
});

export const schema = baseSchema.refine(
  (data) => {
    // Se não for gratuito, itemPrice e maintenancePrice são obrigatórios
    if (!data.is_free) {
      return !!data.itemPrice && !!data.maintenancePrice;
    }
    return true;
  },
  {
    message: "O preço do item e o preço de manutenção são obrigatórios quando a campanha não é gratuita",
    path: ["itemPrice"], // Define em qual campo o erro aparece
  }
);

export const editSchema = baseSchema.refine(
    (data) => {
      // Se não for gratuito, itemPrice e maintenancePrice são obrigatórios
      if (!data.is_free) {
        return !!data.itemPrice && !!data.maintenancePrice;
      }
      return true;
    },
    {
      message: "O preço do item e o preço de manutenção são obrigatórios quando a campanha não é gratuita",
      path: ["itemPrice"], // Define em qual campo o erro aparece
    }
  );

export type FormDataType = z.infer<typeof schema>;
