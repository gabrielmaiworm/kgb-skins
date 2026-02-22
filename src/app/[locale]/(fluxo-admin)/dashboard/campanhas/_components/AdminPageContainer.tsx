"use client";
import React from "react";
import { FileText, List, LayoutDashboard, Users, ShoppingBag, TrendingUp, Wallet, Coins } from "lucide-react";
import { PageBoxLayout } from "@/components/layout/page-box";
import { DataTableCard } from "@/components/cards/data-table";
import { tableColumns } from "./Column";
import { MdOpenInNew } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { DrawerFormComponent } from "@/components/ui/drawer-form";
import { useColumns } from "@/context/ColumnsContext";
import PostFormBox from "./form/FormBox";
import EditFormBox from "./form/EditFormBox";
import { useAllCampaingsQuery } from "@/querys/campaings/all";
import { useDashboardQuery } from "@/querys/dashboard";
import { DashboardMetricsCard } from "@/components/cards/DashboardMetricsCard";
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

  const { data: dashboardData, isLoading: isLoadingDashboard } = useDashboardQuery();
  const formatBRL = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="relative">
      <div className="fixed inset-0 ">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <PageBoxLayout
        titleIcon={{ icon: FileText }}
        title="Gerenciamento de Campanhas"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <DashboardMetricsCard
            title="Total de Campanhas"
            value={isLoadingDashboard ? "—" : (dashboardData?.totalCampaigns ?? 0)}
            description="Quantidade total de campanhas cadastradas"
            icon={<LayoutDashboard />}
          />
          <DashboardMetricsCard
            title="Total de Usuários"
            value={isLoadingDashboard ? "—" : (dashboardData?.totalUsers ?? 0)}
            description="Usuários cadastrados na plataforma"
            icon={<Users />}
          />
          <DashboardMetricsCard
            title="Usuários com Compras"
            value={isLoadingDashboard ? "—" : (dashboardData?.usersWithPurchases ?? 0)}
            description="Usuários que realizaram pelo menos uma compra"
            icon={<ShoppingBag />}
          />
          <DashboardMetricsCard
            title="Receita Total Campanhas"
            value={isLoadingDashboard ? "—" : formatBRL(dashboardData?.totalCampaignRevenue ?? 0)}
            description="Soma da receita bruta das campanhas"
            icon={<TrendingUp />}
          />
          <DashboardMetricsCard
            title="Valor Manutenção"
            value={isLoadingDashboard ? "—" : formatBRL(dashboardData?.totalMaintenanceValue ?? 0)}
            description="Valor total de manutenção das campanhas"
            icon={<Coins />}
          />
          <DashboardMetricsCard
            title="Receita Líquida"
            value={isLoadingDashboard ? "—" : formatBRL(dashboardData?.netRevenue ?? 0)}
            description="Receita após dedução da manutenção"
            icon={<Wallet />}
          />
        </div>
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
