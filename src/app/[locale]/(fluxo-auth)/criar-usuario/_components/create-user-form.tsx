"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { createPublicUserAction } from "@/app/actions/users/create-user";
import { phoneMask } from "@/utils/input-masks";
import { buildAuthRedirectUrl } from "@/utils/invite-url";

const createUserFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }),
  // document: z.string().min(11, { message: "CPF deve ter 11 dígitos" }).max(11, { message: "CPF deve ter 11 dígitos" }),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

interface CreateUserFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateUserForm(props?: CreateUserFormProps) {
  const { onSuccess, onClose } = props ?? {};
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      // document: "",
    },
  });

  async function onSubmit(values: CreateUserFormData) {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);

      const referrerInviteCode = searchParams.get("referrerInviteCode");
      if (referrerInviteCode?.trim()) {
        formData.append("referrerInviteCode", referrerInviteCode.trim());
      }

      const result = await createPublicUserAction({ success: false, message: "" }, formData);

      if (result.success) {
        toast.success("Conta criada com sucesso!", {
          description: "Redirecionando para o login...",
        });
        onSuccess?.();
        const loginUrl = buildAuthRedirectUrl(
          "/login",
          {
            phone: values.phone,
            referrerInviteCode: referrerInviteCode ?? undefined,
          },
          searchParams
        );
        setTimeout(() => {
          window.location.href = loginUrl;
        }, 1500);
      } else {
        toast.error("Erro ao criar conta", {
          description: result.message,
          duration: 10000,
        });
      }
    } catch (error: any) {
      console.error("Erro ao submeter o formulário:", error);
      toast.error("Erro inesperado ao processar a solicitação", {
        description: error.message || "Verifique os detalhes e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Digite seu nome completo" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Digite seu email" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Digite seu telefone (apenas números)"
                  disabled={isLoading}
                  maxLength={15}
                  onChange={(e) => {
                    const value = e.target.value;
                    const maskedValue = phoneMask(value);
                    field.onChange(maskedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Digite seu CPF (apenas números)"
                  disabled={isLoading}
                  maxLength={11}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <Button disabled={isLoading} className="ml-auto w-full mt-4" type="submit">
          Criar conta
        </Button>

        <Button
          type="button"
          variant="link"
          className="text-sm text-muted-foreground"
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              window.location.href = buildAuthRedirectUrl("/login", undefined, searchParams);
            }
          }}
          disabled={isLoading}
        >
          Já tenho uma conta
        </Button>
      </form>
    </Form>
  );
}
