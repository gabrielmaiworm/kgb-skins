import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative overflow-hidden inline-flex items-center rounded-lg justify-center gap-2 text-base font-bold text-white transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "glass-button-default",
        destructive: "glass-button-destructive",
        success: "glass-button-success",
        warning: "glass-button-warning",
        info: "glass-button-info",
        outline: "glass-button-outline",
        secondary: "glass-button-secondary",
        ghost: "glass-button-ghost",
        link: "glass-button-link hover:scale-100",
        gold: "glass-button-gold",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2 text-sm",
        lg: "px-8 py-4 text-lg",
        icon: "h-10 w-10 p-0",
        link: "px-0 py-0",
        full: "px-6 py-3 w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Configurações de gradiente para cada variante
const glassConfig = {
  default: {
    gradient: "from-kgb-red via-kgb-gold to-kgb-red rounded-lg overflow-hidden",
    border: "border-white/20",
  },
  destructive: {
    gradient: "from-red-600 via-red-500 to-red-600 rounded-lg overflow-hidden",
    border: "rounded-lg border-red-300/30",
  },
  success: {
    gradient: "from-green-600 via-emerald-500 to-green-600 rounded-lg overflow-hidden",
    border: "rounded-lg border-green-300/30",
  },
  warning: {
    gradient: "from-orange-600 via-yellow-500 to-orange-600 rounded-lg overflow-hidden",
    border: "rounded-lg border-yellow-300/30",
  },
  info: {
    gradient: "from-blue-600 via-cyan-500 to-blue-600 rounded-lg overflow-hidden",
    border: "rounded-lg border-blue-300/30",
  },
  outline: {
    gradient: "from-white/10 via-white/5 to-white/10 rounded-lg overflow-hidden",
    border: "rounded-lg border",
  },
  secondary: {
    gradient: "from-kgb-gold via-kgb-gold-dark to-kgb-gold rounded-lg overflow-hidden",
    border: "rounded-lg border-kgb-gold/30",
  },
  ghost: {
    gradient: "from-white/5 via-white/10 to-white/5 rounded-lg overflow-hidden",
    border: "rounded-lg border-white/10",
  },
  link: {
    gradient: "",
    border: "rounded-lg ",
  },
  gold: {
    gradient: "from-kgb-gold via-yellow-400 to-kgb-gold rounded-lg overflow-hidden",
    border: "rounded-lg border-kgb-gold/40",
  },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const config = glassConfig[variant as keyof typeof glassConfig] || glassConfig.default;

    // Para link, não precisa do efeito de vidro
    if (variant === "link") {
      return (
        <Comp
          className={cn(
            buttonVariants({ variant, size }),
            "text-kgb-gold underline-offset-4 hover:underline",
            className
          )}
          ref={ref}
          {...props}
          disabled={loading || props.disabled}
        >
          {loading && <Loader2 className="animate-spin relative z-10" />}
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
        disabled={loading || props.disabled}
      >
        {/* Glass background com gradiente */}
        <div className={cn("absolute inset-0 bg-gradient-to-r bg-size-200 animate-gradient-x", config.gradient)} />

        {/* Camada de blur */}
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20 rounded-lg" />

        {/* Borda com brilho */}
        <div className={cn("absolute inset-0 border ", config.border)} />

        {/* Conteúdo */}
        <span className="relative z-10 flex items-center gap-2">
          {loading && <Loader2 className="animate-spin" />}
          {children}
        </span>
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
