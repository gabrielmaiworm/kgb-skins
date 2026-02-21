"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { getSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { phoneMask } from "@/utils/input-masks";
import { updateReferrerAction } from "@/app/actions/users/update-referrer";
import { buildAuthRedirectUrl, appendAuthSearchParams } from "@/utils/invite-url";

interface UserAuthFormProps {
  onOpenCreateUser?: () => void;
}

const emailFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }).min(1, { message: "Este campo é obrigatório" }),
  password: z.string().min(1, { message: "Este campo é obrigatório" }),
});

const phoneFormSchema = z.object({
  phone: z.string().min(9, { message: "Telefone deve ter no mínimo 9 dígitos" }),
});

export default function UserAuthForm({ onOpenCreateUser }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loginMode, setLoginMode] = React.useState<"email" | "phone">("phone");
  const searchParams = useSearchParams();
  const form = useForm<any>({
    resolver: zodResolver(loginMode === "email" ? emailFormSchema : phoneFormSchema),
    defaultValues:
      loginMode === "email"
        ? {
            email: "",
            password: "",
          }
        : {
            phone: "",
          },
  });

  useEffect(() => {
    const phone = searchParams.get("phone");
    if (phone && loginMode === "phone") {
      form.setValue("phone", phone);
    }
  }, [searchParams, form, loginMode]);

  async function onSubmit(values: any) {
    setIsLoading(true);

    try {
      const credentials =
        loginMode === "email"
          ? {
              email: values.email,
              password: values.password,
              loginType: "email" as const,
            }
          : {
              phone: values.phone,
              loginType: "phone" as const,
            };

      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Erro ao logar no sistema", {
          description: result.error,
          duration: 10000,
        });
      } else {
        const session = await getSession();
        const referrerInviteCode = searchParams.get("referrerInviteCode");

        // Se veio com código de indicador, executa a ação antes de redirecionar
        if (referrerInviteCode?.trim()) {
          const referrerResult = await updateReferrerAction({ inviteCode: referrerInviteCode.trim() });
          if (!referrerResult.success) {
            toast.warning(referrerResult.message, {
              description: "Você será redirecionado mesmo assim.",
            });
          }
        }

        toast.success("Login realizado com sucesso!", {
          description: "Redirecionando...",
        });

        if (session?.user.role == "admin") {
          window.location.href = buildAuthRedirectUrl("/dashboard/campanhas", undefined, searchParams);
        } else {
          const callbackUrl = searchParams.get("callbackUrl");
          const destination = callbackUrl
            ? appendAuthSearchParams(callbackUrl, searchParams)
            : buildAuthRedirectUrl("/", undefined, searchParams);
          window.location.href = destination;
        }
      }
    } catch (error: any) {
      console.error("Erro ao submeter o formulário:", error);
      toast("Erro inesperado ao processar a solicitação", {
        description: error.message || "Verifique os detalhes e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form} key={loginMode}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
        {loginMode === "email" ? (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Insira seu email" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Insira sua senha" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
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
                    placeholder="Insira seu telefone (apenas números)"
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
        )}
        <Button disabled={isLoading} className="ml-auto w-full mt-4" type="submit">
          {loginMode === "email" ? "Continue com Email" : "Continue com Telefone"}
        </Button>
        <Button
          type="button"
          variant="link"
          className="text-sm text-muted-foreground"
          onClick={() => setLoginMode(loginMode === "email" ? "phone" : "email")}
          disabled={isLoading}
        >
          {loginMode === "email" ? "Entrar com telefone" : "Entrar com Email"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full mt-2"
          onClick={() => onOpenCreateUser?.()}
          disabled={isLoading}
        >
          Criar conta
        </Button>
      </form>
    </Form>
  );
}
