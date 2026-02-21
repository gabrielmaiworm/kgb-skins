import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Aurora from "@/components/ui/aurora";

interface NotFoundStateProps {
  onBack: () => void;
}

export const NotFoundState = ({ onBack }: NotFoundStateProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="fixed inset-0 -z-10">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>
      <div className="text-center">
        <h1 className="heading-01 text-foreground mb-4">Campanha não encontrada</h1>
        <Button onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>
    </div>
  );
};
