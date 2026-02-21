"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Save } from "lucide-react";
import { FormDataType, schema } from "./schema";
import { InputRender } from "@/components/form/input-render";
import { createChangelogAction } from "@/app/actions/changelog/create";
import { useAllChangelogQuery } from "@/querys/changelog/all";
import { FormInputs } from "./inputs";

const PostFormBox: React.FC<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpen }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [state, formAction] = React.useActionState(createChangelogAction, {
    message: "",
    success: false,
  });
  const formRef = React.useRef<HTMLFormElement>(null);
  const { invalidateQuery } = useAllChangelogQuery();

  React.useEffect(() => {
    setIsLoading(false);
    if (state.success) {
      invalidateQuery();
      toast.success("Sucesso", {
        description: state.message,
      });
      setOpen(false);
    }

    if (!state.success && state.message) {
      toast.error(state.message || "Ops, tivemos um erro", {
        description: state.issues?.length ? (
          <div>
            {state.issues.map((issue, idx) => (
              <div key={idx}>
                • {issue.field ? `${issue.field}: ` : ""}
                {issue.message}
              </div>
            ))}
          </div>
        ) : undefined,
      });
    }
  }, [setOpen, state, invalidateQuery]);

  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      title: "",
      description: "",
      type: "FEATURE",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async () => {
    setIsLoading(true);
    const formData = new FormData();
    const values = form.getValues();
    formData.set("date", values.date);
    formData.set("title", values.title);
    formData.set("description", values.description);
    formData.set("type", values.type);
    await formAction(formData);
  };

  const formInputs = FormInputs(form.control);

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formInputs.map((input) => (
          <InputRender key={input.id} {...input} />
        ))}
        <Button type="submit" disabled={isLoading} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Salvando..." : "Adicionar entrada"}
        </Button>
      </form>
    </Form>
  );
};

export default PostFormBox;
