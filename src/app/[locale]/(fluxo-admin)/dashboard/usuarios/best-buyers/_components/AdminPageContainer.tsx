"use client";

import React from "react";
import { ShoppingCart, List } from "lucide-react";
import { PageBoxLayout } from "@/components/layout/page-box";
import { DataTableCard } from "@/components/cards/data-table";
import { tableColumns } from "./Column";
import { useBestBuyersQuery } from "@/querys/users/best-buyers";
import Aurora from "@/components/ui/aurora";

export const AdminPageContainer = () => {
  const {
    data: bestBuyers,
    isLoading: isLoadingBestBuyers,
    pagination,
    setPagination,
  } = useBestBuyersQuery();

  const items = bestBuyers?.items ?? [];

  return (
    <div className="relative">
      <div className="fixed inset-0 ">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <PageBoxLayout
        titleIcon={{ icon: ShoppingCart }}
        title="Maiores Compradores"
      >
        <DataTableCard
          columns={tableColumns}
          isLoading={isLoadingBestBuyers}
          data={items}
          infos={{
            title: "Usuários que mais compraram",
            description: "Ranking dos usuários com maior valor em compras.",
            icon: List,
          }}
          otherButtons={null}
          queryPagination={pagination}
          setQueryPagination={setPagination}
        />
      </PageBoxLayout>
    </div>
  );
};
