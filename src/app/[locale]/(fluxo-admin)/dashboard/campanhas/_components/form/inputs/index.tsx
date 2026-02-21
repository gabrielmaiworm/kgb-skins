import { Control } from "react-hook-form";
import { FormDataType } from "../schema";
import { InputRenderProps } from "@/components/form/input-render";
import {
  Trophy,
  FileText,
  Ticket,
  DollarSign,
  Calendar,
  Award,
  Shield,
  Star,
  Package,
  Wrench,
  Gauge,
  Sparkles,
  Zap,
} from "lucide-react";
import { priceMask } from "@/utils/input-masks";

export const FormInputs = (
  control: Control<FormDataType>,
  defaultStatusValue?: string
): InputRenderProps<FormDataType>[] => {
  const statusOptions = [
    { label: "Pendente", value: "PENDING" },
    { label: "Ativa", value: "ACTIVE" },
    { label: "Pausada", value: "PAUSED" },
    { label: "Concluída", value: "COMPLETED" },
    { label: "Cancelada", value: "CANCELED" },
  ];

  return [
    {
      id: "title",
      label: "Título da Campanha",
      placeholder: "Ex: Rifa iPhone 15 Pro",
      type: "text",
      icon: <Trophy className="h-4 w-4" />,
      control: control,
      description: "Informe o título principal da campanha.",
    },
    {
      id: "subtitle",
      label: "Subtítulo",
      placeholder: "Ex: Última oportunidade!",
      type: "text",
      icon: <FileText className="h-4 w-4" />,
      control: control,
      description: "Subtítulo chamativo para a campanha (também usado como descrição).",
    },
    {
      id: "totalTickets",
      label: "Total de Tickets",
      placeholder: "Ex: 1000",
      type: "number",
      icon: <Ticket className="h-4 w-4" />,
      control: control,
      description: "Quantidade total de tickets disponíveis.",
    },
    {
      id: "itemPrice",
      label: "Preço do Item (R$)",
      placeholder: "Ex: 1000.00",
      type: "text",
      icon: <Package className="h-4 w-4" />,
      control: control,
      description: "Valor total do item/prêmio.",
      inputMask: priceMask,
    },
    {
      id: "maintenancePrice",
      label: "Preço de Manutenção (%)",
      placeholder: "Ex: 30",
      type: "number",
      icon: <Wrench className="h-4 w-4" />,
      control: control,
      description: "Valor de manutenção ou taxa adicional.",
    },
    {
      id: "itemFloat",
      label: "Float do Item",
      placeholder: "Ex: 0.13",
      type: "number",
      icon: <Gauge className="h-4 w-4" />,
      control: control,
      description: "Valor do float entre 0 e 1.",
    },
    {
      id: "drawDate",
      label: "Data do Sorteio",
      placeholder: "Selecione a data",
      type: "date",
      icon: <Calendar className="h-4 w-4" />,
      control: control,
      description: "Data prevista para o sorteio.",
    },
    // {
    //   id: "prizeDescription",
    //   label: "Descrição do Prêmio (Opcional)",
    //   placeholder: "Descreva o prêmio em detalhes",
    //   type: "textarea",
    //   icon: <Award className="h-4 w-4" />,
    //   control: control,
    //   description: "Informações adicionais sobre o prêmio.",
    // },
    // {
    //   id: "rules",
    //   label: "Regras (Opcional)",
    //   placeholder: "Defina as regras da campanha",
    //   type: "textarea",
    //   icon: <Shield className="h-4 w-4" />,
    //   control: control,
    //   description: "Regras e termos da campanha.",
    // },
    {
      id: "status",
      label: "Status",
      type: "select",
      icon: <Star className="h-4 w-4" />,
      options: statusOptions,
      placeholder: "Selecione o status",
      description: "Status atual da campanha.",
      control,
      defaultValue: defaultStatusValue || "PENDING",
    },
    {
      id: "is_free",
      label: "Campanha Gratuita",
      type: "checkbox",
      checkboxLabel: "Marcar como gratuita",
      icon: <Zap className="h-4 w-4" />,
      control: control,
      description: "Marque se a campanha for gratuita.",
    },
  ];
};

interface EditFormInputsProps {
  control: Control<FormDataType>;
  defaultStatusValue?: string;
}

export const EditFormInputs = ({
  control,
  defaultStatusValue,
}: EditFormInputsProps): InputRenderProps<FormDataType>[] => {
  const baseInputs = FormInputs(control, defaultStatusValue).filter((input) => input.id !== "is_free");
  return [
    ...baseInputs,
    {
      id: "winnerTicket",
      label: "Ticket Vencedor",
      placeholder: "Ex: 123",
      type: "text",
      icon: <Sparkles className="h-4 w-4" />,
      control: control,
      description: "Número do ticket vencedor (apenas para campanhas concluídas).",
    },
  ];
};
