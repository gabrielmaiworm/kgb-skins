"use client";

import React, { useState, useEffect, useRef } from "react";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SimpleImageUploader } from "./SimpleImageUploader";

interface ImagesManagerProps {
  form: UseFormReturn<any>;
  previewImages: string[];
  setPreviewImages: React.Dispatch<React.SetStateAction<string[]>>;
  fileInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}

export const ImagesManager: React.FC<ImagesManagerProps> = ({
  form,
  previewImages,
  setPreviewImages,
  fileInputRefs,
}) => {
  // Removemos o watch para evitar atualizações desnecessárias
  // const formValues = form.watch("images");

  // Adicionamos uma ref para controlar a inicialização
  const initializedRef = useRef(false);

  // Inicializar as imagens quando o componente é montado
  useEffect(() => {
    const formImages = form.getValues().images;

    // Se já temos imagens no formulário, sincronizar os previews
    if (formImages && Array.isArray(formImages) && formImages.length > 0) {
      const hasValidImages = formImages.some((img: any) => img?.image && img.image !== "");

      if (hasValidImages) {
        // Sincronizar previewImages com as imagens do formulário
        const initialPreviews = formImages.map((img: any) => {
          if (img?.image && typeof img.image === "string") {
            return img.image;
          }
          return "";
        });

        // Só atualizar se for diferente do estado atual
        if (JSON.stringify(initialPreviews) !== JSON.stringify(previewImages)) {
          setPreviewImages(initialPreviews);
        }

        // Garantir que temos referências suficientes
        while (fileInputRefs.current.length < formImages.length) {
          fileInputRefs.current.push(null);
        }
      } else if (!initializedRef.current) {
        // Se não temos imagens válidas e não foi inicializado, criar uma vazia
        form.setValue("images", [{ image: "", file: undefined }], { shouldValidate: true });
        setPreviewImages([""]);
        initializedRef.current = true;
      }
    } else if (!initializedRef.current) {
      // Se não temos array de imagens, inicializar com um item vazio
      form.setValue("images", [{ image: "", file: undefined }], { shouldValidate: true });
      setPreviewImages([""]);
      initializedRef.current = true;
    }
  }, [form.watch("images")]);

  // Adicionar uma nova imagem
  const handleAddImage = () => {
    const currentImages = form.getValues().images || [];
    const updatedImages = [...currentImages, { image: "", file: undefined }];

    // Atualizar o formulário
    form.setValue("images", updatedImages, { shouldValidate: true });

    // Atualizar previews
    setPreviewImages((prev) => [...prev, ""]);

    // Garantir que temos referências para todos os inputs
    fileInputRefs.current = [...fileInputRefs.current, null];
  };

  // Remover uma imagem do formulário
  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues().images || [];

    // Se só temos uma imagem, apenas limpar ela em vez de remover
    if (currentImages.length <= 1) {
      const updatedImages = [{ image: "", file: undefined }];
      form.setValue("images", updatedImages, { shouldValidate: true });
      setPreviewImages([""]);
      return;
    }

    // Remover a imagem do array
    const updatedImages = [...currentImages];
    updatedImages.splice(index, 1);

    // Atualizar o formulário
    form.setValue("images", updatedImages, { shouldValidate: true });

    // Atualizar previews
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    // Remover referência
    fileInputRefs.current.splice(index, 1);
  };

  // Atualizar uma imagem específica
  const updateImage = (index: number, imageUrl: string, imageFile?: File) => {
    const currentImages = form.getValues().images || [];

    // Garantir que temos um array de tamanho adequado
    while (currentImages.length <= index) {
      currentImages.push({ image: "", file: undefined });
    }

    // Atualizar a imagem no índice específico
    const updatedImages = [...currentImages];
    updatedImages[index] = {
      image: imageUrl,
      file: imageFile,
    };

    // Atualizar o formulário
    form.setValue("images", updatedImages, { shouldValidate: true });

    // Atualizar preview
    const newPreviews = [...previewImages];
    while (newPreviews.length <= index) {
      newPreviews.push("");
    }
    newPreviews[index] = imageUrl;
    setPreviewImages(newPreviews);
  };

  // Obter as imagens atuais do formulário
  const images = form.getValues().images || [];

  return (
    <div className="space-y-4">
      <Button type="button" variant="outline" onClick={handleAddImage} className="flex items-center gap-1 mt-4">
        <Plus className="w-4 h-4" /> Adicionar Imagem
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((imageItem: any, index: number) => (
          <SimpleImageUploader
            key={`image-uploader-${index}`}
            index={index}
            imageUrl={previewImages[index] || ""}
            onImageChange={(url, file) => updateImage(index, url, file)}
            onRemove={() => handleRemoveImage(index)}
            inputRef={(el) => {
              if (fileInputRefs.current.length <= index) {
                fileInputRefs.current[index] = el;
              } else {
                fileInputRefs.current.splice(index, 1, el);
              }
            }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <p className="text-xs text-muted-foreground">
          É possível arrastar imagens diretamente do WhatsApp Web para os campos acima.
        </p>
      </div>
    </div>
  );
};
