"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Save, User } from "lucide-react";
import { EditUserFormDataType, editUserSchema } from "./schema";
import { InputRender } from "@/components/form/input-render";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTitleIcon } from "@/components/ui/title-icon";
import { EditFormInputs } from "./inputs";
import { extractErrorMessages } from "@/components/form/extractErrorMessages";
import { useAllUsersQuery } from "@/querys/users/all";
import { SkeletonInput } from "@/components/form/skeleton-input";
import { updateUserAction } from "@/app/actions/users/update-user";
import { useColumns } from "@/context/ColumnsContext";
import { useUserByIdQuery } from "@/querys/users/by-id";

const EditFormBox: React.FC<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpen }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [state, formAction] = React.useActionState(updateUserAction, {
    message: "",
    success: false,
  });
  const formRef = React.useRef<HTMLFormElement>(null);
  const { invalidateQuery } = useAllUsersQuery();
  const { itemToUpdate } = useColumns();
  const {
    data: userData,
    isLoading: isUserLoading,
    invalidateQuery: invalidateUserQuery,
  } = useUserByIdQuery(itemToUpdate?.id || "");

  const form = useForm<EditUserFormDataType>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {},
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  React.useEffect(() => {
    if (!userData) return;
    const dataToSet = {
      id: userData.id,
      name: userData.name ?? "",
      email: userData.email ?? "",
      phone: userData.phone ?? "",
    };
    form.reset(dataToSet);
  }, [userData, form]);

  React.useEffect(() => {
    setIsLoading(false);
    if (state.success) {
      invalidateQuery();
      invalidateUserQuery();
      toast.success("Sucesso", {
        description: state.message,
      });
      setOpen(false);
    }

    if (!state.success && state.message) {
      toast.error(state.message || "Ops, tivemos um erro", {
        description: (
          <div>
            {state.issues?.map((issue, idx) => (
              <div key={idx}>
                • {issue.field ? `${issue.field}: ` : ""}
                {issue.message}
              </div>
            ))}
          </div>
        ),
      });
    }
  }, [setOpen, state, invalidateQuery, invalidateUserQuery]);

  const onSubmit = async () => {
    setIsLoading(true);
    const values = form.getValues();
    const formData = new FormData();
    formData.set("id", itemToUpdate?.id || "");
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("phone", values.phone ?? "");
    React.startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className="flex flex-col gap-6"
        action={formAction}
        onSubmit={(evt: React.FormEvent<HTMLFormElement>) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            onSubmit();
          })(evt);
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <SimpleTitleIcon icon={User} title="Dados do usuário" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isUserLoading
                ? [1, 2, 3].map((item) => <SkeletonInput key={item} />)
                : EditFormInputs(form.control as Control<EditUserFormDataType>).map((item) => (
                    <React.Fragment key={item.id}>
                      <InputRender {...item} />
                    </React.Fragment>
                  ))}
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="mt-4 w-full flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
          loading={isLoading}
          onClick={() => {
            const errors = form.formState.errors;
            if (Object.keys(errors).length > 0) {
              const errorMessages = extractErrorMessages(errors);
              toast.error("Verifique os erros no formulário", {
                description: `${errorMessages.length} erro(s) encontrado(s): ${errorMessages.join("; ")}`,
                duration: 5000,
              });
            }
          }}
        >
          <Save className="w-4 h-4" />
          Salvar alterações
        </Button>
      </form>
    </Form>
  );
};

export default EditFormBox;
