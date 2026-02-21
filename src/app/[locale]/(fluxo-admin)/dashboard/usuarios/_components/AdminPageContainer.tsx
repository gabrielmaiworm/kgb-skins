"use client";

import React from "react";
import { Users, List } from "lucide-react";
import { PageBoxLayout } from "@/components/layout/page-box";
import { DataTableCard } from "@/components/cards/data-table";
import { tableColumns } from "./Column";
import { useAllUsersQuery } from "@/querys/users/all";
import { DialogComponent } from "@/components/ui/dialog-form";
import { useColumns } from "@/context/ColumnsContext";
import EditFormBox from "./form/EditFormBox";
import Aurora from "@/components/ui/aurora";

export const AdminPageContainer = () => {
  const { isUpdateDialogOpen, setIsUpdateDialogOpen, itemToUpdate } = useColumns();
  const {
    data: allUsers,
    isLoading: isLoadingAllUsers,
    pagination,
    setPagination,
    setSearchTerm,
  } = useAllUsersQuery();

  return (
    <div className="relative">
      <div className="fixed inset-0 ">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <PageBoxLayout
        titleIcon={{ icon: Users }}
        title="Gerenciamento de Usuários"
      >
        <DataTableCard
          columns={tableColumns}
          isLoading={isLoadingAllUsers}
          data={allUsers?.items || []}
          otherButtons={null}
          infos={{
            title: "Lista completa de usuários",
            description:
              "Visualize e gerencie todos os usuários cadastrados de forma prática e eficiente.",
            icon: List,
          }}
          queryPagination={pagination}
          setQueryPagination={setPagination}
          setSearchTerm={setSearchTerm}
        />

        <DialogComponent
          open={isUpdateDialogOpen}
          setOpen={setIsUpdateDialogOpen}
          Form={EditFormBox}
          buttonTitle="Editar usuário"
          subTitle="Qualquer problema com o preenchimento do formulário entre em contato com o suporte."
          title="Edite os campos para atualizar o usuário."
          notButton
          maxWidth="max-w-[50rem]"
          row={itemToUpdate}
        />
      </PageBoxLayout>
    </div>
  );
};
