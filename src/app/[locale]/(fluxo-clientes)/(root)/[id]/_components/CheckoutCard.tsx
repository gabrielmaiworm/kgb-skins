import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutCardProps {
  selectedCount: number;
  totalAmount: number;
  onCheckout: () => void;
  loading: boolean;
  isFree?: boolean;
}

export const CheckoutCard = ({
  selectedCount,
  totalAmount,
  onCheckout,
  loading,
  isFree = false,
}: CheckoutCardProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="group overflow-hidden rounded-xl sm:rounded-2xl sticky bottom-3 sm:bottom-4 bg-black z-50 shadow-lg">
      <div className="relative z-10 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
          <div>
            <p className="text-xs sm:text-sm text-text-secondary">Cotas selecionadas</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">{selectedCount}</p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-text-secondary">Total</p>
            {isFree ? (
              <p className="text-base sm:text-lg md:text-xl font-bold text-kgb-gold">GRÁTIS</p>
            ) : (
              <p className="text-base sm:text-lg md:text-xl font-bold text-foreground">R$ {totalAmount.toFixed(2)}</p>
            )}
          </div>
        </div>

        <Button loading={loading} variant="default" size="full" onClick={onCheckout} className="h-10 sm:h-11">
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          {isFree ? "Reservar número" : "Finalizar compra"}
        </Button>
      </div>
    </div>
  );
};
