import { Loader2 } from "lucide-react";
import Aurora from "@/components/ui/aurora";

export const LoadingState = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="fixed inset-0 -z-10">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-kgb-gold animate-spin mx-auto mb-4" />
        <p className="body-title text-foreground">Carregando campanha...</p>
      </div>
    </div>
  );
};
