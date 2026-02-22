"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Box, Save, Trophy, Users } from "lucide-react";
import { FormDataType, editSchema } from "./schema";
import { InputRender } from "@/components/form/input-render";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTitleIcon } from "@/components/ui/title-icon";
import { EditFormInputs } from "./inputs";
import { extractErrorMessages } from "@/components/form/extractErrorMessages";
import { useAllCampaingsQuery } from "@/querys/campaings/all";
import { SkeletonInput } from "@/components/form/skeleton-input";
import { imagemInputs } from "./inputs/imagemInput";
import { updateCampaignAction } from "@/app/actions/campaings/edit-campaing";
import { parseFormattedPrice, priceMask } from "@/utils/input-masks";
import { useColumns } from "@/context/ColumnsContext";
import { useCampaingByIdQuery } from "@/querys/campaings";
import { WinnerTicketDrawer } from "./WinnerTicketDrawer";

const EditFormBox: React.FC<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpen }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isWinnerDrawerOpen, setIsWinnerDrawerOpen] = React.useState(false);
  const [state, formAction] = React.useActionState(updateCampaignAction, {
    message: "",
    success: false,
  });
  const [previewImages, setPreviewImages] = React.useState<string[]>([""]);
  const fileInputRefs = React.useRef<(HTMLInputElement | null)[]>([null]);
  const formRef = React.useRef<HTMLFormElement>(null);
  const { invalidateQuery } = useAllCampaingsQuery();
  const { itemToUpdate } = useColumns();
  const {
    data: campaignData,
    isLoading: isCampaignLoading,
    invalidateQuery: invalidateCampaignQuery,
  } = useCampaingByIdQuery(itemToUpdate?.id || "");

  const form = useForm<FormDataType>({
    resolver: zodResolver(editSchema),
    defaultValues: {},
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  React.useEffect(() => {
    const { totalTickets, itemPrice, maintenancePrice, status, coverImage, gallery, drawDate, ...rest } =
      campaignData || {};
    const imagesArray = [coverImage, ...(gallery || [])].filter(Boolean);

    const imagesObjects =
      imagesArray.length > 0
        ? imagesArray.map((url) => ({ image: url, file: undefined }))
        : [{ image: "", file: undefined }];

    const rawItemPrice = campaignData?.itemPrice;
    const itemPriceStr =
      rawItemPrice != null ? priceMask(Number(rawItemPrice).toFixed(2)) : "";

    const dataToSet = {
      ...rest,
      totalTickets: campaignData?.totalTickets?.toString() || "",
      itemPrice: itemPriceStr,
      maintenancePrice: campaignData?.maintenancePrice?.toString() || "",
      images: imagesObjects,
      drawDate: drawDate ? new Date(drawDate).toISOString().slice(0, 10) : "",
    };

    if (imagesArray.length > 0) {
      setPreviewImages(imagesArray as string[]);
    } else {
      setPreviewImages([""]);
    }

    form.reset(dataToSet as any);
  }, [campaignData]);

  React.useEffect(() => {
    setIsLoading(false);
    if (state.success) {
      invalidateQuery();
      invalidateCampaignQuery();
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

    formData.append("id", itemToUpdate?.id || "");

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
              {isCampaignLoading
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
              {isCampaignLoading
                ? [1, 2, 3, 4, 5, 6].map((item) => <SkeletonInput key={item} />)
                : EditFormInputs({
                    control: form.control as Control<FormDataType>,
                    defaultStatusValue: campaignData?.status,
                  }).map((item) => (
                    <React.Fragment key={item.id}>
                      <InputRender {...item} />
                    </React.Fragment>
                  ))}
            </div>
          </CardContent>
        </Card>

        {campaignData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-4 flex-wrap">
                <SimpleTitleIcon icon={Trophy} title={"Definir vencedor"} />
                <Button variant="outline" size="sm" onClick={() => setIsWinnerDrawerOpen(true)}>
                  <Trophy className="w-4 h-4 mr-2" />
                  Definir vencedor
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Selecione o número vencedor da rifa. Ao confirmar, a campanha será marcada automaticamente como concluída.
              </p>
            </CardContent>
          </Card>
        )}

        {campaignData && (
          <WinnerTicketDrawer
            campaign={campaignData}
            open={isWinnerDrawerOpen}
            onOpenChange={setIsWinnerDrawerOpen}
            onSuccess={() => {
              invalidateQuery();
              invalidateCampaignQuery();
            }}
          />
        )}

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
          Editar campanha
        </Button>
      </form>
    </Form>
  );
};

export default EditFormBox;
