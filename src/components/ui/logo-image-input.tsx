import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "./form";

interface LogoImageInputProps {
  registerKey: string;
  title?: string;
  applicationBackground?: string;
  form: any;
  initialImage?: string | null; // nova prop para imagem inicial
}

const LogoImageInput: React.FC<LogoImageInputProps> = ({
  registerKey,
  title,
  applicationBackground,
  form,
  initialImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage || null);

  // Atualiza selectedImage se initialImage mudar
  React.useEffect(() => {
    setSelectedImage(initialImage || null);
  }, [initialImage]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="flex flex-col items-start ">
      <label htmlFor={registerKey} className="cursor-pointer">
        <FormLabel>{title || "Logo"}</FormLabel>
        <div
          className={`w-40 h-24 mt-2 border border-border  flex items-center justify-center relative overflow-hidden ${applicationBackground}`}
        >
          {selectedImage ? (
            <Image
              width={100}
              height={100}
              src={selectedImage}
              alt="Perfil"
              className="w-full h-full object-scale-down"
            />
          ) : (
            <span className=" text-xs">Insira sua logo</span>
          )}
        </div>
      </label>
      <FormField
        key={registerKey}
        control={form.control}
        name={registerKey}
        render={({ field }) => (
          <FormItem className="w-full flex flex-col gap-2 items-start col-span-2">
            <input
              {...field}
              id={registerKey}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LogoImageInput;
