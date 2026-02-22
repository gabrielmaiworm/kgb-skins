"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, List } from "lucide-react";
import { PageBoxLayout } from "@/components/layout/page-box";
import { DataTableCard } from "@/components/cards/data-table";
import { tableColumns } from "./Column";
import { useCampaignOrdersByUserIdQuery } from "@/querys/campaings/orders-by-user";
import { useUserByIdQuery } from "@/querys/users/by-id";
import Aurora from "@/components/ui/aurora";

export const AdminPageContainer = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: user } = useUserByIdQuery(userId ?? "");
  const { data, isLoading, pagination, setPagination } = useCampaignOrdersByUserIdQuery(userId ?? "");

  const tickets = data?.tickets ?? [];

  return (
    <div className="relative">
      <div className="fixed inset-0">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <PageBoxLayout
        titleIcon={{ icon: ShoppingCart }}
        title={user?.name ? `Pedidos - ${user.name}` : "Pedidos do usuário"}
      >
        <DataTableCard
          columns={tableColumns}
          isLoading={isLoading}
          data={tickets}
          infos={{
            title: "Lista de pedidos",
            description: user?.name ? `Histórico de pedidos de ${user.name}.` : "Histórico de pedidos do usuário.",
            icon: List,
          }}
          otherButtons={null}
          queryPagination={{
            ...pagination,
            totalItems: data?.total ?? 0,
          }}
          setQueryPagination={setPagination}
        />
      </PageBoxLayout>
    </div>
  );
};
