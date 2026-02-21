"use client";
import React, { useMemo } from "react";
import { ShoppingCart, List } from "lucide-react";
import { PageBoxLayout } from "@/components/layout/page-box";
import { DataTableCard } from "@/components/cards/data-table";
import { tableColumns } from "./Column";
import { useCampaignOrdersAdminQuery } from "@/querys/campaings/orders-admin";
import { useCampaingByIdQuery } from "@/querys/campaings";
import Aurora from "@/components/ui/aurora";
import { useParams } from "next/navigation";
import type { CampaignOrderAdmin, GroupedOrderAdmin } from "@/@types/campaings";

function groupOrdersByPayment(orders: CampaignOrderAdmin[]): GroupedOrderAdmin[] {
  const byPayment = new Map<string, CampaignOrderAdmin[]>();

  for (const order of orders) {
    const key = order.payment?.id ?? order.id;
    const group = byPayment.get(key) ?? [];
    group.push(order);
    byPayment.set(key, group);
  }

  return Array.from(byPayment.values()).map((group) => {
    const first = group[0];
    const numbers = group.map((o) => o.number).sort((a, b) => a - b);
    const ticketIds = group.map((o) => o.id);
    const createdAt = group.reduce(
      (min, o) => (new Date(o.createdAt) < new Date(min) ? o.createdAt : min),
      first.createdAt
    );
    const updatedAt = group.reduce(
      (max, o) => (new Date(o.updatedAt) > new Date(max) ? o.updatedAt : max),
      first.updatedAt
    );

    return {
      id: first.payment?.id ?? first.id,
      numbers,
      ticketIds,
      user: first.user,
      payment: first.payment,
      status: first.status,
      createdAt,
      updatedAt,
    };
  });
}

export const AdminPageContainer = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { data: ordersData, isLoading: isLoadingOrders } = useCampaignOrdersAdminQuery(campaignId);
  const { data: campaign } = useCampaingByIdQuery(campaignId ?? "");

  const groupedOrders = useMemo(
    () => groupOrdersByPayment(ordersData?.orders ?? []),
    [ordersData?.orders]
  );

  const campaignTitle = campaign?.title ?? "";

  return (
    <div className="relative">
      <div className="fixed inset-0 ">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <PageBoxLayout
        titleIcon={{ icon: ShoppingCart }}
        title={campaignTitle ? `Gerenciamento de Pedidos - ${campaignTitle}` : "Gerenciamento de Pedidos"}
      >
        <DataTableCard
          columns={tableColumns}
          isLoading={isLoadingOrders}
          data={groupedOrders}
          infos={{
            title: campaignTitle
              ? `Lista de pedidos da campanha "${campaignTitle}"`
              : "Lista de pedidos da campanha",
            description: "Visualize e gerencie todos os pedidos desta campanha de forma prática e eficiente.",
            icon: List,
          }}
          otherButtons={null}
        />
      </PageBoxLayout>
    </div>
  );
};
