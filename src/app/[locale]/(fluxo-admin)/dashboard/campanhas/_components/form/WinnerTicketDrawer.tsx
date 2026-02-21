"use client";

import React, { useMemo, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCampaignOrdersAdminQuery } from "@/querys/campaings/orders-admin";
import { updateCampaignWinnerAction } from "@/app/actions/campaings/update-winner";
import { useAllCampaingsQuery } from "@/querys/campaings/all";
import { useCampaingByIdQuery } from "@/querys/campaings";
import { toast } from "sonner";
import { CampaignListItem } from "@/@types/campaings";

interface WinnerTicketDrawerProps {
  campaign: CampaignListItem;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export const WinnerTicketDrawer = ({
  campaign,
  onSuccess,
  children,
}: WinnerTicketDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: ordersData, invalidateQuery: invalidateOrders } =
    useCampaignOrdersAdminQuery(campaign.id);
  const { invalidateQuery: invalidateCampaigns } = useAllCampaingsQuery();
  const { invalidateQuery: invalidateCampaign } = useCampaingByIdQuery(campaign.id);

  const quotas = useMemo(() => {
    const totalTickets = campaign.totalTickets;
    const orders = ordersData?.orders || [];

    const occupiedNumbers = new Map<number, "RESERVED" | "PAID">();
    orders.forEach((order) => {
      occupiedNumbers.set(order.number, order.status);
    });

    const quotasArray: { numero: number; status: "livre" | "reservado" | "pago" }[] = [];
    for (let i = 1; i <= totalTickets; i++) {
      const orderStatus = occupiedNumbers.get(i);
      if (orderStatus === "PAID") {
        quotasArray.push({ numero: i, status: "pago" });
      } else if (orderStatus === "RESERVED") {
        quotasArray.push({ numero: i, status: "reservado" });
      } else {
        quotasArray.push({ numero: i, status: "livre" });
      }
    }
    return quotasArray;
  }, [campaign, ordersData]);

  const filteredQuotas = useMemo(() => {
    if (!searchTerm.trim()) return quotas;
    const term = searchTerm.replace(/\D/g, "");
    if (!term) return quotas;
    const num = parseInt(term, 10);
    const padded = term.padStart(3, "0");
    return quotas.filter(
      (q) =>
        q.numero === num ||
        String(q.numero).includes(term) ||
        q.numero.toString().padStart(3, "0").includes(padded)
    );
  }, [quotas, searchTerm]);

  const handleConfirm = async () => {
    if (selectedNumber === null) {
      toast.error("Selecione um número vencedor");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateCampaignWinnerAction(campaign.id, selectedNumber);
      if (result.success) {
        toast.success(result.message);
        invalidateCampaigns();
        invalidateCampaign();
        invalidateOrders();
        onSuccess?.();
        setOpen(false);
        setSelectedNumber(null);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro ao definir número vencedor");
    } finally {
      setIsLoading(false);
    }
  };

  const canSelect = (quota: { numero: number; status: string }) =>
    quota.status === "pago" || quota.status === "reservado" || quota.status === "livre";

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        {children ?? (
          <Button variant="outline" size="sm">
            <Trophy className="w-4 h-4 mr-2" />
            Definir vencedor
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent
        className="h-full w-full overflow-y-auto [&[data-vaul-drawer-direction=right]]:!w-[min(100%,42rem)] [&[data-vaul-drawer-direction=right]]:!max-w-[42rem]"
      >
        <div className="flex flex-col h-full overflow-y-auto w-full">
          <DrawerHeader className="border-b shrink-0">
            <DrawerTitle>Selecionar número vencedor</DrawerTitle>
            <DrawerDescription>
              Escolha o número que foi sorteado na campanha &quot;{campaign.title}&quot;
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 p-6 overflow-y-auto w-full min-w-0 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número (ex: 006)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1.5 sm:gap-2">
              {filteredQuotas.map((quota) => {
                const isSelected = selectedNumber === quota.numero;
                const isClickable = canSelect(quota);

                return (
                  <button
                    key={quota.numero}
                    type="button"
                    onClick={() => isClickable && setSelectedNumber(quota.numero)}
                    disabled={!isClickable}
                    className={cn(
                      "aspect-square rounded-lg text-xs sm:text-sm font-bold transition-all min-h-0",
                      quota.status === "livre" &&
                        "bg-quota-livre-bg border border-quota-livre-border text-quota-livre-text hover:bg-quota-livre-hover",
                      quota.status === "reservado" &&
                        "bg-quota-reservado-bg border border-quota-reservado-border text-quota-reservado-text",
                      quota.status === "pago" &&
                        "bg-quota-pago-bg border border-quota-pago-border text-quota-pago-text",
                      isSelected && "ring-2 ring-kgb-gold ring-offset-2 ring-offset-background scale-105",
                      !isClickable && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {quota.numero.toString().padStart(3, "0")}
                  </button>
                );
              })}
            </div>

            {filteredQuotas.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum número encontrado para &quot;{searchTerm}&quot;
              </p>
            )}

            {selectedNumber !== null && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">
                  Número selecionado: <span className="text-kgb-gold">{selectedNumber.toString().padStart(3, "0")}</span>
                </p>
                <Button
                  onClick={handleConfirm}
                  loading={isLoading}
                  className="w-full"
                  disabled={isLoading}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Confirmar vencedor
                </Button>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
