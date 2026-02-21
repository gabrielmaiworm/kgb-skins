"use client";

import RifaCard from "@/components/ui/rifa-card";
import { InviteCodeCard } from "@/components/ui/invite-code-card";
import { ReferrerCodeCard } from "@/components/ui/referrer-code-card";
import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAllCampaingsQuery } from "@/querys/campaings/all";
import Pagination from "@/components/ui/pagination";

export default function RifasGrid() {
  const { data: session } = useSession();
  const { data, isLoading, searchTerm, setSearchTerm, pagination, setPagination } = useAllCampaingsQuery();
  const showInviteCard = !!session?.user?.inviteCode;
  const showReferrerCard = !!session?.user && !session?.user?.hasReferredByInviteCode;
  const showInviteSection = showInviteCard || showReferrerCard;
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null);

  const campanhas = useMemo(() => {
    const items = data?.items ?? [];
    return items.slice().sort((a, b) => {
      if (a.status === "ACTIVE" && b.status !== "ACTIVE") return -1;
      if (a.status !== "ACTIVE" && b.status === "ACTIVE") return 1;

      if (a.status !== "ACTIVE" && b.status !== "ACTIVE") {
        const dateA = a.drawDate ? new Date(a.drawDate).getTime() : new Date(a.createdAt).getTime();
        const dateB = b.drawDate ? new Date(b.drawDate).getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      }

      return 0;
    });
  }, [data]);

  const opcoesFiltro = [
    { label: "Todas", value: null as string | null },
    { label: "Ativas", value: "ACTIVE" },
    { label: "Concluídas", value: "COMPLETED" },
  ];

  const campanhasFiltradas = useMemo(() => {
    return campanhas.filter((campanha) => {
      const statusMatch = !filtroStatus || campanha.status === filtroStatus;
      return statusMatch;
    });
  }, [campanhas, filtroStatus]);

  return (
    <div className="mx-auto">
      <div
        className={`mb-12 flex flex-col ${showInviteSection ? "lg:flex-row items-center lg:items-start justify-between" : ""} gap-6`}
      >
        <div className={`text-center space-y-4 flex-1 ${showInviteSection ? "lg:text-left" : ""}`}>
          <h1 className="heading-02-bold md:heading-01 text-foreground">
            Rifas <span className="text-kgb-gold">Disponíveis</span>
          </h1>
          <p className={`body-title text-text-subtle max-w-2xl mx-auto ${showInviteSection ? "lg:mx-0" : ""}`}>
            Participe das melhores rifas de skins de CS:GO e concorra a itens raros e valiosos
          </p>
        </div>
        {(showInviteCard || showReferrerCard) && (
          <div className="hidden lg:flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0 lg:min-w-0">
            {showInviteCard && (
              <div className="w-full sm:w-auto sm:min-w-[300px] lg:min-w-[320px]">
                <InviteCodeCard />
              </div>
            )}
            {showReferrerCard && (
              <div className="w-full sm:w-auto sm:min-w-[300px] lg:min-w-[320px]">
                <ReferrerCodeCard />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 ">
        <div className="w-full md:w-1/2 max-w-md">
          <Input
            type="text"
            placeholder="Buscar por título, descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full md:w-1/2">
          {opcoesFiltro.map((opcao) => {
            const isSelected = filtroStatus === opcao.value;
            return (
              <Button
                key={opcao.label}
                variant={isSelected ? "gold" : "outline"}
                size="sm"
                className={isSelected ? "font-bold uppercase" : "uppercase"}
                onClick={() => setFiltroStatus(opcao.value)}
              >
                {opcao.label}
              </Button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="body-title text-text-muted mt-8 text-center">Carregando campanhas...</div>
      ) : (
        <>
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
            {campanhasFiltradas.map((campanha) => (
              <RifaCard key={campanha.id} campaign={campanha} />
            ))}
            {campanhasFiltradas.length === 0 && (
              <div className="body-title text-text-muted mt-8 text-center">Nenhuma campanha encontrada.</div>
            )}
          </div>

          {campanhasFiltradas.length > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.pageIndex}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.pageSize}
                setQueryPagination={setPagination}
              />
            </div>
          )}

          {showInviteSection && (
            <div className="flex lg:hidden flex-col sm:flex-row gap-4 w-full mt-8 justify-center sm:justify-start">
              {showInviteCard && (
                <div className="w-full sm:min-w-[300px] sm:max-w-[340px]">
                  <InviteCodeCard />
                </div>
              )}
              {showReferrerCard && (
                <div className="w-full sm:min-w-[300px] sm:max-w-[340px]">
                  <ReferrerCodeCard />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
