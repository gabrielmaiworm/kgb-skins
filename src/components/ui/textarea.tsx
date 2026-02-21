import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "w-full h-11 min-h-[5rem] px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-kgb-gold/50 focus:bg-white/10 transition-all duration-300",
          "autofill:bg-white/5 autofill:text-white autofill:shadow-[inset_0_0_0_1000px_rgba(255,255,255,0.05)]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
