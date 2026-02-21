"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <input
        type={isPasswordVisible ? "text" : type}
        className={cn(
          "w-full h-11 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-kgb-gold/50 focus:bg-white/10 transition-all duration-300",
          "autofill:bg-white/5 autofill:text-white autofill:shadow-[inset_0_0_0_1000px_rgba(255,255,255,0.05)]",
          className
        )}
        ref={ref}
        {...props}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-3 flex items-center text-white/60 hover:text-white transition-colors focus:outline-none"
        >
          <div className="relative w-full">
            <EyeOffIcon
              className={cn(
                "h-5 w-5 transition-opacity transform duration-300 ease-in-out",
                isPasswordVisible ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
              )}
            />
            <EyeIcon
              className={cn(
                "absolute inset-0 h-5 w-5 transition-opacity transform duration-300 ease-in-out",
                isPasswordVisible ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
              )}
            />
          </div>
        </button>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
