"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";

interface SimpleImageUploaderProps {
  index: number;
  imageUrl: string;
  onImageChange: (url: string, file?: File) => void;
  onRemove: () => void;
  inputRef?: (element: HTMLInputElement | null) => void;
}

export const SimpleImageUploader: React.FC<SimpleImageUploaderProps> = ({
  index,
  imageUrl,
  onImageChange,
  onRemove,
  inputRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Processar arquivo de imagem
  const processImageFile = async (file: File | null) => {
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);

      // Verificar tamanho máximo
      if (file.size > MAX_FILE_SIZE) {
        setError(`Imagem muito grande! Limite de 5MB. Tamanho atual: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        setIsLoading(false);
        return;
      }

      // Verificar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        setError("Por favor, selecione apenas arquivos de imagem.");
        setIsLoading(false);
        return;
      }

      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (e) => {
          const base64Image = e.target?.result as string;

          // Verificar tamanho da string base64 (aproximadamente)
          if (base64Image.length > 5242880) {
            // ~5MB em base64
            setError("Mesmo após a compressão, a imagem é muito grande. Tente uma imagem menor.");
            setIsLoading(false);
            return;
          }

          // Atualizar a imagem
          onImageChange(base64Image, file);
          setIsLoading(false);
        };

        reader.onerror = () => {
          setError("Erro ao ler o arquivo. Tente novamente.");
          setIsLoading(false);
        };
      } catch (err) {
        setError("Erro ao processar imagem. Tente novamente.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Erro ao processar imagem. Tente novamente.");
      setIsLoading(false);
    }
  };

  // Processar imagem a partir de URL
  const processImageFromUrl = async (url: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(url);
      if (!response.ok) throw new Error("Não foi possível acessar a imagem");

      const contentLength = response.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
        setError(`Imagem muito grande! Limite de 1MB.`);
        setIsLoading(false);
        return;
      }

      const blob = await response.blob();
      if (!blob.type.startsWith("image/")) {
        setError("O arquivo não é uma imagem válida");
        setIsLoading(false);
        return;
      }

      const file = new File([blob], `image_from_url.${blob.type.split("/")[1]}`, { type: blob.type });

      // Processar o arquivo
      await processImageFile(file);
    } catch (err) {
      setError("Erro ao processar imagem da URL.");
      setIsLoading(false);
    }
  };

  // Lidar com mudança no input de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
      e.target.value = ""; // Limpar o input para permitir selecionar o mesmo arquivo novamente
    }
  };

  // Eventos de arrastar e soltar
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // Verificar se há arquivos no evento de drop
    if (e.dataTransfer.files?.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        processImageFile(file);
        return;
      }
    }

    // Verificar se há URLs no evento de drop (para links do WhatsApp)
    const items = Array.from(e.dataTransfer.items);
    for (const item of items) {
      if (item.kind === "string" && (item.type.match("^text/uri-list") || item.type === "text/plain")) {
        try {
          const url = await new Promise<string>((resolve) => {
            item.getAsString(resolve);
          });

          if (url.startsWith("http") || url.startsWith("blob:")) {
            await processImageFromUrl(url);
            return;
          }
        } catch (err) {
          setError("Não foi possível processar esta imagem. Tente baixá-la primeiro.");
        }
      }
    }
  };

  return (
    <div className="col-span-1">
      <div className="relative">
        {isLoading ? (
          <div className="relative w-full aspect-[9/16] rounded-lg overflow-hidden border border-border flex items-center justify-center bg-muted">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : imageUrl ? (
          <div className="relative w-full aspect-[9/16] rounded-lg overflow-hidden border border-border group">
            <Image
              src={imageUrl}
              alt={`Imagem ${index + 1}`}
              fill
              className="object-cover"
              onError={() => {
                setError("Erro ao carregar a imagem.");
                onImageChange(""); // Limpar a imagem em caso de erro
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button type="button" size="icon" variant="destructive" className="rounded-full" onClick={onRemove}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed ${
              isDragging ? "border-primary" : "border-border"
            } rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors w-full aspect-[9/16] flex flex-col items-center justify-center ${
              isDragging ? "bg-primary/5" : "hover:bg-accent/20"
            }`}
            onClick={() => {
              const input = document.getElementById(`file-input-${index}`);
              if (input) input.click();
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mb-2 text-primary" />
            <span className="font-medium text-sm mb-1">Upload</span>
            <p className="text-xs text-muted-foreground">arraste ou clique</p>
            <p className="text-xs text-muted-foreground">máximo: 1MB</p>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        )}
        <input
          id={`file-input-${index}`}
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
