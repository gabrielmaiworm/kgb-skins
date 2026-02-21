"use client";

import { Loader2 } from "lucide-react";
import Aurora from "@/components/ui/aurora";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Aurora */}
      <div className="absolute inset-0 -z-10">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      {/* Loading Content */}
      <div className="relative z-10">
        <div className="glass-card">
          <div className="glass-bg" />
          <div className="glass-blur" />
          <div className="glass-border" />
          
          <div className="relative z-10 p-12 flex flex-col items-center gap-6">
            <Loader2 className="w-16 h-16 text-kgb-gold animate-spin" />
            <span className="heading-04-bold text-foreground">Carregando...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
