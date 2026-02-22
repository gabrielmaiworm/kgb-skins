"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Box, Info, Save, Users } from "lucide-react";
import { FormDataType, schema } from "./schema";
import { InputRender } from "@/components/form/input-render";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTitleIcon } from "@/components/ui/title-icon";
import { FormInputs } from "./inputs";
import { extractErrorMessages } from "@/components/form/extractErrorMessages";
import { postCreateCampaignAction } from "@/app/actions/campaings/create-campaing";
import { parseFormattedPrice } from "@/utils/input-masks";
import { useAllCampaingsQuery } from "@/querys/campaings/all";
import { SkeletonInput } from "@/components/form/skeleton-input";
import { imagemInputs } from "./inputs/imagemInput";

const PostFormBox: React.FC<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpen }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [state, formAction] = React.useActionState(postCreateCampaignAction, {
    message: "",
    success: false,
  });
  const [previewImages, setPreviewImages] = React.useState<string[]>([""]);
  const fileInputRefs = React.useRef<(HTMLInputElement | null)[]>([null]);
  const formRef = React.useRef<HTMLFormElement>(null);
  const { invalidateQuery } = useAllCampaingsQuery();

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
  }, [setOpen, state]);

  const form = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues:
      process.env.NODE_ENV === "development"
        ? {
            title: "Rifa Cu do Tuxo",
            subtitle: "Última oportunidade!",
            totalTickets: "100",
            itemPrice: "1000.00",
            maintenancePrice: "30.00",
            itemFloat: "0.13",
            drawDate: "2022-12-31",
            prizeDescription: "Cu do Tuxo 256GB",
            rules: "Regras da campanha",
            status: "ACTIVE",
            featured: false,
            skinOwner: "",
            inspectionLink: "",
          }
        : {
            title: "",
            subtitle: "",
            totalTickets: "",
            itemPrice: "",
            maintenancePrice: "",
            itemFloat: "",
            drawDate: "",
            prizeDescription: "",
            rules: "",
            status: "PENDING",
            featured: false,
            skinOwner: "",
            inspectionLink: "",
          },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async () => {
    setIsLoading(true);

    const formData = new FormData(formRef.current!);
    const formValues = form.getValues();
    const imagesToSend: File[] = [];

    if (formValues.images && Array.isArray(formValues.images)) {
      await Promise.all(
        formValues.images.map(async (imgData: any, index: number) => {
          if (!imgData || !imgData.image || typeof imgData.image !== "string" || imgData.image.length === 0) {
            return;
          }

          try {
            if (imgData.file instanceof File) {
              imagesToSend.push(imgData.file);
            } else if (imgData.image.startsWith("data:")) {
              // Converter base64 para File
              const matches = imgData.image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
              if (!matches || matches.length !== 3) {
                console.error(`Invalid base64 format for image ${index}`);
                return;
              }

              const type = matches[1];
              const base64Data = matches[2];
              const byteCharacters = atob(base64Data);

              // Converter base64 para blob
              const byteArrays: Uint8Array[] = [];
              for (let i = 0; i < byteCharacters.length; i += 512) {
                const slice = byteCharacters.slice(i, i + 512);
                const byteNumbers = new Array(slice.length);
                for (let j = 0; j < slice.length; j++) {
                  byteNumbers[j] = slice.charCodeAt(j);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
              }

              const blob = new Blob(byteArrays as any, { type });
              const file = new File([blob], `product-image-${index}.jpg`, { type });
              imagesToSend.push(file);
            } else if (imgData.image.startsWith("http") || imgData.image.startsWith("blob:")) {
              // Buscar a imagem da URL
              const response = await fetch(imgData.image);
              if (!response.ok) {
                return;
              }

              const blob = await response.blob();
              const file = new File([blob], `product-image-${index}.jpg`, { type: blob.type });
              imagesToSend.push(file);
            }
          } catch (error) {
            console.error(`Error processing image ${index}:`, error);
          }
        })
      );
    }

    imagesToSend.forEach((file) => {
      formData.append("images", file);
    });

    // Garante itemPrice parseado conforme inputMask (R$ 41,34 -> 41.34)
    formData.set("itemPrice", parseFormattedPrice(formValues.itemPrice || ""));

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
              <SimpleTitleIcon icon={Box} title={"Imagens da campanha"} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1">
              {isLoading
                ? [1, 2].map((item) => <SkeletonInput key={item} />)
                : imagemInputs(form.control as Control<FormDataType>, form).map((item) => (
                    <React.Fragment key={item.id}>
                      <InputRender
                        {...item}
                        {...(item.type === "file"
                          ? {
                              previewImages,
                              setPreviewImages,
                              fileInputRefs,
                            }
                          : {})}
                      />
                    </React.Fragment>
                  ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <SimpleTitleIcon icon={Users} title={"Informações gerais"} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FormInputs(form.control as Control<FormDataType>).map((item) => (
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
          Criar Campanha
        </Button>
      </form>
    </Form>
  );
};

export default PostFormBox;
