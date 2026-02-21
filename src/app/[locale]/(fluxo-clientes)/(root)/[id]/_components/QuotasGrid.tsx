import { cn } from "@/lib/utils";

interface Quota {
  numero: number;
  status: "livre" | "reservado" | "pago";
}

interface QuotasGridProps {
  quotas: Quota[];
  selectedQuotas: number[];
  onToggleQuota: (numero: number) => void;
  isFree?: boolean;
}

export const QuotasGrid = ({ quotas, selectedQuotas, onToggleQuota, isFree = false }: QuotasGridProps) => {
  return (
    <div className="glass-card">
      <div className="glass-bg" />
      <div className="glass-blur" />
      <div className="glass-border" />

      <div className="relative z-10 p-4 sm:p-6 overflow-y-auto scrollbar-thin scrollbar-webkit">
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1.5 sm:gap-2">
          {quotas.length > 0 ? (
            quotas.map((quota) => {
              const isDisabled =
                quota.status !== "livre" ||
                (isFree && selectedQuotas.length >= 1 && !selectedQuotas.includes(quota.numero));

              return (
                <button
                  key={quota.numero}
                  onClick={() => !isDisabled && onToggleQuota(quota.numero)}
                  disabled={isDisabled}
                  className={cn(
                    "aspect-square rounded-lg text-xs sm:text-sm font-bold transition-all relative overflow-hidden min-h-0",
                    quota.status === "livre" &&
                      !selectedQuotas.includes(quota.numero) &&
                      "bg-quota-livre-bg border border-quota-livre-border text-quota-livre-text hover:bg-quota-livre-hover hover:scale-105",
                    quota.status === "livre" &&
                      selectedQuotas.includes(quota.numero) &&
                      "bg-quota-selected-bg border-2 border-quota-selected-border text-quota-selected-text hover:scale-105",
                    quota.status === "reservado" &&
                      "bg-quota-reservado-bg border border-quota-reservado-border text-quota-reservado-text cursor-not-allowed opacity-50",
                    quota.status === "pago" &&
                      "bg-quota-pago-bg border border-quota-pago-border text-quota-pago-text cursor-not-allowed opacity-50",
                    isDisabled && quota.status === "livre" && "opacity-30 cursor-not-allowed"
                  )}
                >
                  {quota.numero.toString().padStart(3, "0")}
                </button>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 sm:py-10 text-sm text-text-muted">Nenhum número disponível.</div>
          )}
        </div>
      </div>
    </div>
  );
};
