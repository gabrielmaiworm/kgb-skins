"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { UserPlus, List } from "lucide-react";
import { PageBoxLayout } from "@/components/layout/page-box";
import { DataTableCard } from "@/components/cards/data-table";
import { tableColumns } from "./Column";
import { useInvitedUsersQuery } from "@/querys/users/invited";
import { useUserByIdQuery } from "@/querys/users/by-id";
import Aurora from "@/components/ui/aurora";

export const AdminPageContainer = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: user } = useUserByIdQuery(userId ?? "");
  const { data, isLoading } = useInvitedUsersQuery(userId, !!userId);

  const items = data?.items ?? [];
  const totalItems = data?.totalItems ?? 0;

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: Math.max(totalItems || 10, 10),
    totalItems,
  });

  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, totalItems }));
  }, [totalItems]);

  return (
    <div className="relative">
      <div className="fixed inset-0 ">
        <Aurora colorStops={["#E60000", "#FFD700", "#8B0000"]} />
      </div>

      <PageBoxLayout
        titleIcon={{ icon: UserPlus }}
        title={`Usuários convidados${user?.name ? ` por ${user.name}` : ""}`}
      >
        <DataTableCard
          columns={tableColumns}
          isLoading={isLoading}
          data={items}
          infos={{
            title: "Lista de usuários convidados",
            description: `Pessoas que foram indicadas por este usuário${user?.inviteCode ? ` (código ${user.inviteCode})` : ""}.`,
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
