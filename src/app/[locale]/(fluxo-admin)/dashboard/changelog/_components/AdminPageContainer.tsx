"use client";

import React from "react";
import { History, List } from "lucide-react";
import { PageBoxLayout } from "@/components/layout/page-box";
import { DataTableCard } from "@/components/cards/data-table";
import { tableColumns } from "./Column";
import { useAllChangelogQuery } from "@/querys/changelog/all";
import Aurora from "@/components/ui/aurora";
import { MdOpenInNew } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { DialogComponent } from "@/components/ui/dialog-form";
import PostFormBox from "./form/FormBox";

export const AdminPageContainer = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const {
    data: changelogData,
    isLoading: isLoadingChangelog,
    pagination,
    setPagination,
  } = useAllChangelogQuery();

  const otherButtons = () => {
    return (
      <>
        <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <MdOpenInNew />
          Adicionar entrada
        </Button>
        <DialogComponent
          open={isAddDialogOpen}
          setOpen={setIsAddDialogOpen}
          Form={PostFormBox}
          buttonTitle="Adicionar entrada"
          subTitle="Preencha os campos para registrar uma nova entrada no changelog."
          title="Nova entrada no changelog"
          notButton
          maxWidth="max-w-[36rem]"
        />
      </>
    );
  };

  return (
    <div className="relative">
      <div className="fixed inset-0">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <PageBoxLayout
        titleIcon={{ icon: History }}
        title="Gerenciamento de Changelog"
      >
        <DataTableCard
          columns={tableColumns}
          isLoading={isLoadingChangelog}
          data={changelogData?.items || []}
          otherButtons={otherButtons}
          infos={{
            title: "Lista de entradas do changelog",
            description:
              "Visualize e gerencie as entradas do changelog (data, título, tipo, descrição) de forma prática.",
            icon: List,
          }}
          queryPagination={pagination}
          setQueryPagination={setPagination}
        />
      </PageBoxLayout>
    </div>
  );
};
