"use client";

import React from "react";
import { FileText, List } from "lucide-react";
import { PageBoxLayout } from "@/components/layout/page-box";
import { DataTableCard } from "@/components/cards/data-table";
import { tableColumns } from "./Column";
import { useAllLogsQuery } from "@/querys/logs/all";
import Aurora from "@/components/ui/aurora";

export const AdminPageContainer = () => {
  const {
    data: allLogs,
    isLoading: isLoadingLogs,
    pagination,
    setPagination,
    setSearchTerm,
  } = useAllLogsQuery();

  return (
    <div className="relative">
      <div className="fixed inset-0 ">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <PageBoxLayout
        titleIcon={{ icon: FileText }}
        title="Gerenciamento de Logs"
      >
        <DataTableCard
          columns={tableColumns}
          isLoading={isLoadingLogs}
          data={allLogs?.items || []}
          otherButtons={null}
          infos={{
            title: "Lista de logs da API",
            description:
              "Visualize todas as requisições registradas (rota, método, usuário, status e payload) de forma prática.",
            icon: List,
          }}
          queryPagination={pagination}
          setQueryPagination={setPagination}
          setSearchTerm={setSearchTerm}
        />
      </PageBoxLayout>
    </div>
  );
}
