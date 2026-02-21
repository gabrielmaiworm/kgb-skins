"use client";
import React from "react";
import { AlertTriangle, FileText, List } from "lucide-react";
import { PageBoxLayout } from "@/components/layout/page-box";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTableCard } from "@/components/cards/data-table";
import { tableColumns } from "./Column";
import { MdOpenInNew } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { DrawerFormComponent } from "@/components/ui/drawer-form";
import { useColumns } from "@/context/ColumnsContext";
import PostFormBox from "./form/FormBox";
import EditFormBox from "./form/EditFormBox";
import { useAllCampaingsQuery } from "@/querys/campaings/all";
import Aurora from "@/components/ui/aurora";

export const AdminPageContainer = () => {
  const { isUpdateDialogOpen, setIsUpdateDialogOpen, itemToUpdate } = useColumns();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const {
    data: allCampaigns,
    isLoading: isLoadingAllCampaigns,
    pagination,
    setPagination,
    setSearchTerm,
  } = useAllCampaingsQuery();

  const otherButtons = () => {
    return (
      <>
        <Button size={"sm"} onClick={() => setIsAddDialogOpen(true)}>
          <MdOpenInNew />
          Adicionar Campanha
        </Button>
        <DrawerFormComponent
          open={isAddDialogOpen}
          setOpen={setIsAddDialogOpen}
          Form={PostFormBox}
          subTitle="Qualquer problema com o preenchimento do formulário entre em contato com o suporte."
          title="Preencha os campos para finalizar a adição da campanha."
          maxWidth="max-w-[42rem]"
        />
      </>
    );
  };

  return (
    <div className="relative">
      <div className="fixed inset-0 ">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <PageBoxLayout
        titleIcon={{ icon: FileText }}
        title="Gerenciamento de Campanhas"
      >
        <DataTableCard
          columns={tableColumns}
          isLoading={isLoadingAllCampaigns}
          data={allCampaigns?.items || []}
          otherButtons={otherButtons}
          infos={{
            title: "Lista completa de campanhas",
            description: "Visualize, edite e gerencie todas as campanhas cadastradas de forma prática e eficiente.",
            icon: List,
          }}
          queryPagination={pagination}
          setQueryPagination={setPagination}
          setSearchTerm={setSearchTerm}
        />

        <DrawerFormComponent
          open={isUpdateDialogOpen}
          setOpen={setIsUpdateDialogOpen}
          Form={EditFormBox}
          subTitle="Qualquer problema com o preenchimento do formulário entre em contato com o suporte."
          title="Preencha os campos para finalizar a edição da campanha."
          maxWidth="max-w-[42rem]"
          row={itemToUpdate}
        />
      </PageBoxLayout>
    </div>
  );
};
