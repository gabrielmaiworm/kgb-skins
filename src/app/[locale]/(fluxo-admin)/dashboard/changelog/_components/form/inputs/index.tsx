import { Control } from "react-hook-form";
import { FormDataType } from "../schema";
import { InputRenderProps } from "@/components/form/input-render";
import { Calendar, FileText, MessageSquare, Tag } from "lucide-react";

export const FormInputs = (control: Control<FormDataType>): InputRenderProps<FormDataType>[] => [
  {
    id: "date",
    label: "Data",
    placeholder: "YYYY-MM-DD",
    type: "date",
    icon: <Calendar className="h-4 w-4" />,
    control,
    description: "Data da alteração/mudança.",
  },
  {
    id: "title",
    label: "Título",
    placeholder: "Ex: Central de Atendimento via WhatsApp",
    type: "text",
    icon: <FileText className="h-4 w-4" />,
    control,
    description: "Título da entrada do changelog.",
  },
  {
    id: "description",
    label: "Descrição",
    placeholder: "Descreva a mudança em detalhes...",
    type: "textarea",
    icon: <MessageSquare className="h-4 w-4" />,
    control,
    rows: 4,
    description: "Descrição detalhada da alteração.",
  },
  {
    id: "type",
    label: "Tipo",
    type: "select",
    icon: <Tag className="h-4 w-4" />,
    control,
    options: [
      { value: "SUPPORT", label: "Suporte" },
      { value: "FEATURE", label: "Funcionalidade" },
      { value: "BUGFIX", label: "Correção" },
    ],
    placeholder: "Selecione o tipo",
    description: "Categoria da entrada.",
  },
];
