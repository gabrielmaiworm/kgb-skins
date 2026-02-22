"use client";

import React from "react";
import { Package, List } from "lucide-react";
import { PageBoxLayout } from "@/components/layout/page-box";
import { DataTableCard } from "@/components/cards/data-table";
import { tableColumns } from "./Column";
import { useSkinOffersAdminQuery } from "@/querys/skin-offers/all-admin";
import Aurora from "@/components/ui/aurora";

export const AdminPageContainer = () => {
  const {
    data: offersData,
    isLoading,
    pagination,
    setPagination,
    setSearchTerm,
  } = useSkinOffersAdminQuery();

  return (
    <div className="relative">
      <div className="fixed inset-0">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <PageBoxLayout titleIcon={{ icon: Package }} title="Ofertas de Skins">
        <DataTableCard
          columns={tableColumns}
          isLoading={isLoading}
          data={offersData?.items || []}
          otherButtons={null}
          infos={{
            title: "Lista de ofertas de skins",
            description:
              "Visualize e gerencie as ofertas de skins enviadas pelos usuários. Aceite, negue ou conclua ofertas.",
            icon: List,
          }}
          queryPagination={{
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            totalItems: pagination.totalItems,
          }}
          setQueryPagination={setPagination}
          setSearchTerm={setSearchTerm}
        />
      </PageBoxLayout>
    </div>
  );
};
