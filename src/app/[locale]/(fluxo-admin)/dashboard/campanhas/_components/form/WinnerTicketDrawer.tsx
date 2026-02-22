"use client";

import React, { useMemo, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCampaignOrdersAdminQuery } from "@/querys/campaings/orders-admin";
import { updateCampaignWinnerWithFormDataAction } from "@/app/actions/campaings/update-winner";
import { useAllCampaingsQuery } from "@/querys/campaings/all";
import { useCampaingByIdQuery } from "@/querys/campaings";
import { toast } from "sonner";
import { CampaignListItem, GetCampaignByIdResponse } from "@/@types/campaings";

interface WinnerTicketDrawerProps {
  campaign: CampaignListItem | GetCampaignByIdResponse;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const WinnerTicketDrawer = ({
  campaign,
  onSuccess,
  open: controlledOpen,
  onOpenChange,
}: WinnerTicketDrawerProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: ordersData, invalidateQuery: invalidateOrders } = useCampaignOrdersAdminQuery(campaign.id);
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
        q.numero === num || String(q.numero).includes(term) || q.numero.toString().padStart(3, "0").includes(padded)
    );
  }, [quotas, searchTerm]);

  const handleConfirm = async () => {
    if (selectedNumber === null) {
      toast.error("Selecione um número vencedor");
      return;
    }

    setIsLoading(true);
    try {
      const imageUrls = [campaign.coverImage, ...(campaign.gallery || [])].filter(Boolean) as string[];
      if (imageUrls.length === 0) {
        toast.error("Campanha sem imagens.");
        setIsLoading(false);
        return;
      }

      const imageFiles: File[] = [];
      for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Falha ao buscar imagem: ${url}`);
        const blob = await response.blob();
        const filename = i === 0 ? "cover.jpg" : `gallery-${i}.jpg`;
        const file = new File([blob], filename, { type: blob.type || "image/jpeg" });
        imageFiles.push(file);
      }

      const formData = new FormData();
      formData.append("id", campaign.id);
      formData.append("title", campaign.title);
      formData.append("subtitle", campaign.subtitle || "");
      formData.append("description", campaign.description || "");
      formData.append("totalTickets", String(campaign.totalTickets));
      formData.append("itemPrice", campaign.isFree ? "0" : String(campaign.itemPrice));
      formData.append("maintenancePrice", campaign.isFree ? "0" : String(campaign.maintenancePrice));
      formData.append("itemCondition", campaign.itemCondition || "");
      formData.append("itemFloat", campaign.itemFloat || "0");
      formData.append("drawDate", campaign.drawDate || new Date().toISOString().slice(0, 10));
      formData.append("is_free", campaign.isFree ? "true" : "false");
      formData.append("mode", campaign.mode || "MANUAL");
      formData.append("featured", String((campaign as GetCampaignByIdResponse).featured ?? false));
      formData.append("winnerTicket", String(selectedNumber));
      formData.append("status", "COMPLETED");

      const campaignData = campaign as GetCampaignByIdResponse;
      if (campaignData.prizeDescription) {
        formData.append("prizeDescription", campaignData.prizeDescription);
      }
      if (campaignData.rules) {
        formData.append("rules", campaignData.rules);
      }

      formData.append("coverImage", imageFiles[0]);
      for (let i = 1; i < imageFiles.length; i++) {
        formData.append("gallery", imageFiles[i]);
      }

      const result = await updateCampaignWinnerWithFormDataAction(formData);
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
    <Drawer open={open} onOpenChange={(o) => setOpen(o)} direction="right">
      <DrawerContent className="h-full w-full overflow-y-auto [&[data-vaul-drawer-direction=right]]:!w-[min(100%,42rem)] [&[data-vaul-drawer-direction=right]]:!max-w-[42rem]">
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
                  Número selecionado:{" "}
                  <span className="text-kgb-gold">{selectedNumber.toString().padStart(3, "0")}</span>
                </p>
                <Button onClick={handleConfirm} loading={isLoading} className="w-full" disabled={isLoading}>
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
