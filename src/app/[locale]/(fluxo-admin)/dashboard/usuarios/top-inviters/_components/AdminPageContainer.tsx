"use client";

import React from "react";
import { UserPlus, List } from "lucide-react";
import { PageBoxLayout } from "@/components/layout/page-box";
import { DataTableCard } from "@/components/cards/data-table";
import { tableColumns } from "./Column";
import { useTopInvitersQuery } from "@/querys/users/top-inviters";
import Aurora from "@/components/ui/aurora";

export const AdminPageContainer = () => {
  const {
    data: topInviters,
    isLoading: isLoadingTopInviters,
    pagination,
    setPagination,
  } = useTopInvitersQuery();

  const items = topInviters?.items ?? [];

  return (
    <div className="relative">
      <div className="fixed inset-0 ">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <PageBoxLayout
        titleIcon={{ icon: UserPlus }}
        title="Top Convidadores"
      >
        <DataTableCard
          columns={tableColumns}
          isLoading={isLoadingTopInviters}
          data={items}
          infos={{
            title: "Usuários que mais convidaram",
            description: "Ranking dos usuários com maior número de indicações.",
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
