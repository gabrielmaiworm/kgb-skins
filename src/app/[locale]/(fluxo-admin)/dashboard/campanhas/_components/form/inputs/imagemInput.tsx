import { Control, UseFormReturn } from "react-hook-form";
import { schema } from "../schema";
import { InputRenderProps } from "@/components/form/input-render";
import { Info } from "lucide-react";

export const imagemInputs = (
  control: Control<typeof schema._type>,
  form: UseFormReturn<typeof schema._type>
): InputRenderProps<typeof schema._type>[] => {
  return [
    {
      id: "images",
      label: "A primeira imagem servirá como capa da campanha",
      type: "file",
      icon: <Info className="h-4 w-4" />,
      control: control,
      form: form,
      description: "Envie uma ou mais fotos do produto",
    },
  ];
};
