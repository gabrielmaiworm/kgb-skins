import { Control } from "react-hook-form";
import { EditUserFormDataType } from "../schema";
import { InputRenderProps } from "@/components/form/input-render";
import { User, Mail, Phone } from "lucide-react";

export const EditFormInputs = (control: Control<EditUserFormDataType>): InputRenderProps<EditUserFormDataType>[] => [
  {
    id: "name",
    label: "Nome",
    placeholder: "Ex: João Silva",
    type: "text",
    icon: <User className="h-4 w-4" />,
    control,
    description: "Nome completo do usuário.",
  },
  {
    id: "email",
    label: "E-mail",
    placeholder: "Ex: joao@example.com",
    type: "text",
    icon: <Mail className="h-4 w-4" />,
    control,
    description: "E-mail de contato do usuário.",
  },
  {
    id: "phone",
    label: "Telefone",
    placeholder: "Ex: +5511999999999",
    type: "text",
    icon: <Phone className="h-4 w-4" />,
    control,
    description: "Telefone do usuário (opcional).",
  },
];
