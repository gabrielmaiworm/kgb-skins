"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

type NextImageType = {
  imageUrl: string;
  imageDarkUrl?: string;
  altImage: string;
  extraClassName?: string;
  className?: string;
  ariaLabel: string;
  sizes: string;
  fill?: boolean;
  draggable?: boolean;
  priority?: boolean;
  blurDataURL?: string;
};

export const NextImage: React.FC<NextImageType> = ({
  altImage,
  ariaLabel,
  imageUrl,
  imageDarkUrl,
  className,
  extraClassName,
  fill,
  draggable,
  sizes,
}) => {
  const [isMounted, setIsMounted] = React.useState<boolean>(false);
  const { theme } = useTheme();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <span></span>;
  }

  return (
    <div
      unselectable="on"
      onDragStart={(e) => e.preventDefault()}
      className="relative w-full h-full overflow-hidden"
      title={ariaLabel}
    >
      <Image
        src={imageDarkUrl && theme == "dark" ? imageDarkUrl : imageUrl}
        alt={altImage}
        aria-label={ariaLabel}
        className={`${className || "w-full h-full object-cover select-none"} ${extraClassName}`}
        fill={fill || false}
        draggable={draggable || false}
        width={fill ? 0 : 500}
        height={fill ? 0 : 600}
        sizes={sizes}
        quality={100}
      />
    </div>
  );
};
