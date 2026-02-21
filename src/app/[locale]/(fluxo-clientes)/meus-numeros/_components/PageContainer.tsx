import Aurora from "@/components/ui/aurora";
import MeusNumerosGrid from "./meus-numeros-grid";

export const PageContainer = () => {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <div className="relative pt-28 pb-12 px-4">
        <MeusNumerosGrid />
      </div>
    </div>
  );
};
