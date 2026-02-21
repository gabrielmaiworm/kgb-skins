"use client";

import { Control, ControllerRenderProps, FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../ui/form";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import React, { useState, useRef, useEffect } from "react";
import { ImagesManager } from "./ImagesManager";
import { MultiSelect } from "../ui/multi-select";

// Tipo mais específico para os valores do select
type SelectOption = {
  value: string;
  label: string;
};

// Propriedades comuns a todos os tipos de input - tornamos TFieldValues genérico
interface BaseInputProps<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  control: Control<TFieldValues>;
  description?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
}

// Propriedades específicas para cada tipo de input
interface TextInputProps<TFieldValues extends FieldValues = FieldValues> extends BaseInputProps<TFieldValues> {
  type: "text" | "number" | "email" | "password" | "tel" | "url" | "custom" | "date";
  placeholder?: string;
  inputMask?: (value: string) => string;
}

interface TextareaInputProps<TFieldValues extends FieldValues = FieldValues> extends BaseInputProps<TFieldValues> {
  type: "textarea";
  placeholder?: string;
  rows?: number;
}

interface CheckboxInputProps<TFieldValues extends FieldValues = FieldValues> extends BaseInputProps<TFieldValues> {
  type: "checkbox";
  checkboxLabel?: string;
}

interface SwitchInputProps<TFieldValues extends FieldValues = FieldValues> extends BaseInputProps<TFieldValues> {
  type: "switch";
  switchLabel?: string;
}

interface SelectInputProps<TFieldValues extends FieldValues = FieldValues> extends BaseInputProps<TFieldValues> {
  type: "select" | "multiselect";
  options: SelectOption[];
  placeholder?: string;
  defaultValue?: string | string[];
}

// Novo tipo para input de arquivo/imagem
interface FileInputProps<TFieldValues extends FieldValues = FieldValues> extends BaseInputProps<TFieldValues> {
  type: "file";
  form: UseFormReturn<TFieldValues>;
  // Estas props são opcionais na interface, mas serão verificadas em tempo de execução
  previewImages?: string[];
  setPreviewImages?: React.Dispatch<React.SetStateAction<string[]>>;
  fileInputRefs?: React.MutableRefObject<(HTMLInputElement | null)[]>;
}

// União de todos os tipos específicos
export type InputRenderProps<TFieldValues extends FieldValues = FieldValues> =
  | TextInputProps<TFieldValues>
  | TextareaInputProps<TFieldValues>
  | CheckboxInputProps<TFieldValues>
  | SwitchInputProps<TFieldValues>
  | SelectInputProps<TFieldValues>
  | FileInputProps<TFieldValues>;

// Componente principal - agora aceita tipos genéricos
export const InputRender = <TFieldValues extends FieldValues = FieldValues>(props: InputRenderProps<TFieldValues>) => {
  // Estado local para o caso de não serem fornecidos os estados para o tipo "file"
  const [localPreviewImages, setLocalPreviewImages] = useState<string[]>([""]);
  const localFileInputRefs = useRef<(HTMLInputElement | null)[]>([null]);

  // Memoizamos o valor de fileProps para evitar recalcular em cada renderização
  const fileProps = props.type === "file" ? (props as FileInputProps<TFieldValues>) : null;

  // Referência para armazenar se já inicializamos o formulário
  const initializedRef = useRef(false);

  // Hook useEffect movido para fora da condição para seguir as regras de Hooks
  // e com dependências corretamente declaradas para evitar loops
  useEffect(() => {
    // Apenas executar a lógica se for um campo do tipo "file" e ainda não foi inicializado
    if (fileProps && !initializedRef.current) {
      const previewImages = fileProps.previewImages || localPreviewImages;
      const setPreviewImagesFunc = fileProps.setPreviewImages || setLocalPreviewImages;

      const currentImages = fileProps.form.getValues()[fileProps.id];
      if (!currentImages || !Array.isArray(currentImages) || currentImages.length === 0) {
        // Inicializar com um item vazio
        fileProps.form.setValue(fileProps.id as any, [{ image: "", file: undefined }] as any, { shouldValidate: true });

        // Inicializar o preview também
        if (previewImages.length === 0) {
          setPreviewImagesFunc([""]);
        }

        // Marcar como inicializado
        initializedRef.current = true;
      } else {
        // Se já temos imagens, também marcamos como inicializado
        initializedRef.current = true;
      }
    }
  }, [fileProps, localPreviewImages]);

  // Verificar se o componente é do tipo "file" e se tem todas as props necessárias
  if (props.type === "file" && fileProps) {
    // Usar props fornecidas ou fallback para estado local
    const previewImages = fileProps.previewImages || localPreviewImages;
    const setPreviewImages = fileProps.setPreviewImages || setLocalPreviewImages;
    const fileInputRefs = fileProps.fileInputRefs || localFileInputRefs;

    return (
      <FormField
        key={props.id}
        control={props.control as unknown as Control<FieldValues>}
        name={props.id as unknown as FieldPath<FieldValues>}
        render={({ field }) => (
          <FormItem className={cn("w-full flex flex-col gap-2 items-start", props.containerClassName)}>
            <FormLabel className={cn("flex items-center gap-2 text-sm font-medium", props.labelClassName)}>
              {props.icon && props.icon}
              {props.label}
            </FormLabel>

            <ImagesManager
              form={fileProps.form as unknown as UseFormReturn<any>}
              previewImages={previewImages}
              setPreviewImages={setPreviewImages}
              fileInputRefs={fileInputRefs}
            />

            {props.description && <FormDescription className="text-xs">{props.description}</FormDescription>}
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    );
  }

  // Renderização padrão para outros tipos de input
  return (
    <FormField
      key={props.id}
      control={props.control as unknown as Control<FieldValues>}
      name={props.id as unknown as FieldPath<FieldValues>}
      render={({ field }) => (
        <FormItem className={cn("w-full flex flex-col gap-2 items-start", props.containerClassName)}>
          <FormLabel className={cn("flex items-center gap-2 text-sm font-medium", props.labelClassName)}>
            {props.icon && props.icon}
            {props.label}
          </FormLabel>

          {renderInputByType(props, field)}

          {props.description && <FormDescription className="text-xs">{props.description}</FormDescription>}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

// Função auxiliar para renderizar os outros tipos de input
const renderInputByType = <TFieldValues extends FieldValues = FieldValues>(
  props: InputRenderProps<TFieldValues>,
  field: ControllerRenderProps<FieldValues, string>
) => {
  switch (props.type) {
    case "text":
    case "email":
    case "password":
    case "tel":
    case "url":
    case "number":
    case "date":
      return (
        <Input
          className={cn("w-full transition-all focus:ring-2 focus:ring-primary/20", props.className)}
          placeholder={props.placeholder}
          disabled={props.disabled}
          type={props.type}
          {...field}
          value={field.value ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            const maskedValue = props.inputMask ? props.inputMask(value) : value;
            field.onChange(maskedValue);
          }}
        />
      );

    case "textarea":
      return (
        <Textarea
          className={cn("w-full transition-all focus:ring-2 focus:ring-primary/20 resize-none", props.className)}
          placeholder={props.placeholder}
          disabled={props.disabled}
          rows={props.rows || 3}
          {...field}
          value={field.value ?? ""}
        />
      );

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
            disabled={props.disabled}
            className={cn("data-[state=checked]:bg-primary", props.className)}
            id={`checkbox-${props.id}`}
            {...field}
          />
          {props.checkboxLabel && (
            <label
              htmlFor={`checkbox-${props.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {props.checkboxLabel}
            </label>
          )}
        </div>
      );

    case "switch":
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
            disabled={props.disabled}
            className={cn("data-[state=checked]:bg-primary", props.className)}
            id={`switch-${props.id}`}
            {...field}
          />
          {props.switchLabel && (
            <label
              htmlFor={`switch-${props.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {props.switchLabel}
            </label>
          )}
        </div>
      );

    case "select":
      return (
        <Select
          {...field}
          onValueChange={field.onChange}
          defaultValue={props.defaultValue ?? field.value}
          disabled={props.disabled}
        >
          <SelectTrigger className={cn("w-full transition-all focus:ring-2 focus:ring-primary/20", props.className)}>
            <SelectValue placeholder={props.placeholder || "Selecione uma opção"} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "multiselect":
      // Utiliza o componente MultiSelect, integrando com react-hook-form e mantendo o padrão visual
      // O valor do field é sempre um array de strings
      // As props do MultiSelect são mapeadas a partir das props atuais
      // O onValueChange atualiza o valor do field
      // O defaultValue é o valor inicial do field
      // O disabled, className, placeholder e outras props são repassadas
      // O componente MultiSelect deve estar importado corretamente
      // Se necessário, ajuste o import: import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";
      return (
        <MultiSelect
          {...field}
          options={props.options}
          onValueChange={field.onChange}
          defaultValue={field.value ?? props.defaultValue ?? []}
          placeholder={props.placeholder || "Selecione opções"}
          disabled={props.disabled}
          className={cn("w-full", props.className)}
          animationConfig={{
            popoverAnimation: "none",
            badgeAnimation: "none",
          }}
        />
      );

    default:
      return null;
  }
};
