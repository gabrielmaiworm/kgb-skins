"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Calendar, ExternalLink } from "lucide-react";
import { SkinOfferListItem } from "@/@types/skin-offers";
import { concludeSkinOfferAction } from "@/app/actions/skin-offers/conclude";
import { priceMask, parseFormattedPrice } from "@/utils/input-masks";
import { toast } from "sonner";
import { getSkinportViewerUrl } from "@/utils/skinport-url";

interface ConcludeOfferDrawerProps {
  offer: SkinOfferListItem;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ConcludeOfferDrawer = ({
  offer,
  open = false,
  onOpenChange,
  onSuccess,
}: ConcludeOfferDrawerProps) => {
  const [balanceAmountStr, setBalanceAmountStr] = useState("");
  const [pendingDays, setPendingDays] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setBalanceAmountStr("");
      setPendingDays(1);
    }
  }, [open]);

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const masked = priceMask(value);
    setBalanceAmountStr(masked);
  };

  const handleConfirm = async () => {
    const amount = parseFloat(parseFormattedPrice(balanceAmountStr));
    if (!amount || amount <= 0) {
      toast.error("Informe um valor maior que zero");
      return;
    }
    if (pendingDays < 1) {
      toast.error("Os dias pendente devem ser pelo menos 1");
      return;
    }

    setIsLoading(true);
    try {
      const result = await concludeSkinOfferAction(offer.id, {
        balanceAmount: amount,
        pendingDays,
      });
      if (result.success) {
        toast.success(result.message);
        onSuccess?.();
        onOpenChange?.(false);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro ao concluir oferta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={(o) => onOpenChange?.(o)} direction="right">
      <DrawerContent
        className="h-full w-full overflow-y-auto [&[data-vaul-drawer-direction=right]]:!w-[min(100%,28rem)] [&[data-vaul-drawer-direction=right]]:!max-w-[28rem]"
      >
        <div className="flex flex-col h-full overflow-y-auto w-full">
          <DrawerHeader className="border-b shrink-0">
            <DrawerTitle>Concluir oferta</DrawerTitle>
            <DrawerDescription>
              Informe o saldo que será creditado ao usuário e por quantos dias ficará pendente na conta.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 p-6 space-y-4">
            <div className="p-3 rounded-lg bg-black/20 border border-white/10">
              <p className="body-caption text-text-muted">Cliente</p>
              <p className="body-paragraph-bold text-foreground">{offer.userName}</p>
              <p className="body-callout text-text-subtle">{offer.userEmail}</p>
              <a
                href={getSkinportViewerUrl(offer.inspectLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="body-callout text-kgb-gold hover:underline inline-flex items-center gap-1 mt-2"
              >
                <ExternalLink className="w-3 h-3" />
                Ver skin no Skinport
              </a>
            </div>

            <div>
              <label htmlFor="balanceAmount" className="body-callout text-text-muted block mb-2">
                Valor do saldo (R$)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  id="balanceAmount"
                  type="text"
                  placeholder="R$ 0,00"
                  value={balanceAmountStr}
                  onChange={handleBalanceChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pendingDays" className="body-callout text-text-muted block mb-2">
                Dias em que o saldo ficará pendente
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  id="pendingDays"
                  type="number"
                  min={1}
                  placeholder="1"
                  value={pendingDays}
                  onChange={(e) => setPendingDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="pl-10"
                />
              </div>
              <p className="body-caption text-text-muted mt-1">
                O saldo ficará indisponível para uso até a data de liberação
              </p>
            </div>
          </div>

          <DrawerFooter>
            <Button
              onClick={handleConfirm}
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              Confirmar conclusão
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
