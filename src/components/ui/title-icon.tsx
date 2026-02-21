import React, { ElementType } from "react";

type Variant = "default" | "warning" | "info" | "destructive";

const variantClasses = {
  default: {
    border: "border-primary",
    bg: "bg-primary-40",
    text: "text-primary",
  },
  warning: {
    border: "border-warning",
    bg: "bg-warning-40",
    text: "text-warning",
  },
  info: {
    border: "border-info",
    bg: "bg-info-40",
    text: "text-info",
  },
  destructive: {
    border: "border-destructive",
    bg: "bg-destructive-40",
    text: "text-destructive",
  },
};

const textVariantClasses = {
  default: {
    title: "text-foreground",
    description: "text-muted-foreground",
  },
  warning: {
    title: "text-warning",
    description: "text-warning",
  },
  info: {
    title: "text-info",
    description: "text-info",
  },
  destructive: {
    title: "text-destructive",
    description: "text-destructive",
  },
};

interface TitleIconProps {
  icon: ElementType;
  variant?: Variant;
}

export const TitleIcon: React.FC<TitleIconProps> = ({ icon, variant = "default" }) => {
  const Icon = icon;
  const { border, bg, text } = variantClasses[variant];
  return (
    <div
      className={`rounded-lg border ${border} ${bg} ${text} flex items-center justify-center w-11 h-11 aspect-square`}
    >
      <Icon className="h-6 w-6" />
    </div>
  );
};

interface SimpleTitleIconProps {
  icon: ElementType;
  variant?: Variant;
  title: string;
  description?: string;
  textVariant?: Variant;
}

export const SimpleTitleIcon: React.FC<SimpleTitleIconProps> = ({
  icon,
  variant = "default",
  title,
  description,
  textVariant = "default",
}) => {
  const Icon = icon;
  const { bg, text } = variantClasses[variant];
  const { title: titleText, description: descriptionText } = textVariantClasses[textVariant];

  return (
    <div className={`flex gap-4 ${!description && "items-center"}`}>
      <div className={`rounded-lg ${bg} ${text} flex items-center justify-center w-8 h-8 aspect-square`}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className={`body-title-bold ${titleText}`}>{title}</h3>
        {description && <p className={`body-paragraph ${descriptionText}`}>{description}</p>}
      </div>
    </div>
  );
};
