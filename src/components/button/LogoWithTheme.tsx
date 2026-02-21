"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { NextImage } from "../ui/NextImage";

export const LogoWithTheme = () => {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  if (!mounted) {
    return (
      <Link href={"/login"} className="relative w-100%  h-[1.875rem] ">
        <NextImage
          imageUrl="/img/logo.jpeg"
          altImage="Logo da BIOMOB"
          ariaLabel="Logo da BIOMOB"
          sizes="100vw"
          className="w-[6.25rem] h-auto aspect-[16/9]"
        />
      </Link>
    );
  }

  return (
    <Link href={"/login"} className="relative w-100%  h-100% ">
      {theme == "light" ? (
        <NextImage
          imageUrl="/img/logo.jpeg"
          altImage="Logo da BIOMOB"
          ariaLabel="Logo da BIOMOB"
          sizes="100vw"
          className="w-[6.75rem] h-auto aspect-[16/9]"
        />
      ) : (
        <NextImage
          imageUrl="/img/logo-dark.png"
          altImage="Logo da BIOMOB"
          ariaLabel="Logo da BIOMOB"
          sizes="100vw"
          className="w-[6.25rem] h-auto aspect-[16/9]"
        />
      )}
    </Link>
  );
};
