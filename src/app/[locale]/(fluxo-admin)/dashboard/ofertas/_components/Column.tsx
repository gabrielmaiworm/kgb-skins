"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Link2, User, Mail, Phone, DollarSign, Clock, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UnsortableHeader } from "@/components/table/SortableHeader";
import { DropDownItem } from "@/components/table/dropDownItem";
import { Badge } from "@/components/ui/badge";
import { SkinOfferListItem, SkinOfferStatus } from "@/@types/skin-offers";
import { useSkinOffersAdminQuery } from "@/querys/skin-offers/all-admin";
import { acceptSkinOfferAction } from "@/app/actions/skin-offers/accept";
import { denySkinOfferAction } from "@/app/actions/skin-offers/deny";
import { toast } from "sonner";
import { ConcludeOfferDrawer } from "./ConcludeOfferDrawer";
import { getSkinportViewerUrl } from "@/utils/skinport-url";

type OfferRowType = { row: { original: SkinOfferListItem } };

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const statusConfig: Record<
  SkinOfferStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" }
> = {
  AWAITING_RESPONSE: { label: "Aguardando resposta", variant: "outline" },
  PENDING: { label: "Pendente", variant: "outline" },
  DENIED: { label: "Negado", variant: "outline" },
  COMPLETED: { label: "Concluída", variant: "outline" },
};

export const LineActions: React.FC<OfferRowType> = ({ row }) => {
  const [isConcludeDrawerOpen, setIsConcludeDrawerOpen] = React.useState(false);
  const { invalidateQuery } = useSkinOffersAdminQuery();
  const item = row.original;
  const status = item.status;

  async function handleAccept() {
    try {
      const result = await acceptSkinOfferAction(item.id);
      if (result.success) {
        toast.success(result.message);
        invalidateQuery();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro ao aceitar oferta");
    }
  }

  async function handleDeny() {
    try {
      const result = await denySkinOfferAction(item.id);
      if (result.success) {
        toast.success(result.message);
        invalidateQuery();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro ao negar oferta");
    }
  }

  if (!item) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {status === "AWAITING_RESPONSE" && <DropDownItem onClick={handleAccept}>Aceitar</DropDownItem>}
          {(status === "AWAITING_RESPONSE" || status === "PENDING") && (
            <DropDownItem onClick={handleDeny} end={status !== "PENDING"}>
              Negar
            </DropDownItem>
          )}
          {status === "PENDING" && (
            <DropDownItem end onClick={() => setIsConcludeDrawerOpen(true)}>
              Concluir
            </DropDownItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConcludeOfferDrawer
        offer={item}
        open={isConcludeDrawerOpen}
        onOpenChange={setIsConcludeDrawerOpen}
        onSuccess={invalidateQuery}
      />
    </>
  );
};

export const tableColumns: ColumnDef<SkinOfferListItem>[] = [
  {
    accessorKey: "inspectLink",
    header: (props) => <UnsortableHeader {...props} columnKey="inspectLink" title="Link" icon={Link2} />,
    cell: ({ row }) => {
      const rawLink = row.original.inspectLink;
      const viewerUrl = getSkinportViewerUrl(rawLink);
      return (
        <a
          href={viewerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="body-callout text-kgb-gold underline underline-offset-2 hover:opacity-90 cursor-pointer whitespace-nowrap"
          title="Abrir no visualizador 3D Skinport"
        >
          Ver skin
        </a>
      );
    },
  },
  {
    accessorKey: "userName",
    header: (props) => <UnsortableHeader {...props} columnKey="userName" title="Nome" icon={User} />,
    cell: ({ getValue }) => <span className="body-paragraph">{(getValue() as string) || "—"}</span>,
  },
  {
    accessorKey: "userEmail",
    header: (props) => <UnsortableHeader {...props} columnKey="userEmail" title="Email" icon={Mail} />,
    cell: ({ getValue }) => (
      <span className="body-callout text-text-subtle truncate max-w-[180px] block">
        {(getValue() as string) || "—"}
      </span>
    ),
  },
  {
    accessorKey: "userPhone",
    header: (props) => <UnsortableHeader {...props} columnKey="userPhone" title="Telefone" icon={Phone} />,
    cell: ({ getValue }) => <span className="body-callout">{(getValue() as string) || "—"}</span>,
  },
  {
    accessorKey: "offeredAmount",
    header: (props) => <UnsortableHeader {...props} columnKey="offeredAmount" title="Valor (R$)" icon={DollarSign} />,
    cell: ({ row }) => {
      const amount = row.original.offeredAmount;
      return <span className="body-paragraph-bold text-kgb-gold">{amount != null ? formatBRL(amount) : "—"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: (props) => <UnsortableHeader {...props} columnKey="status" title="Status" icon={Clock} />,
    cell: ({ getValue }) => {
      const s = getValue() as SkinOfferStatus;
      const config = statusConfig[s] ?? { label: String(s), variant: "outline" as const };
      const variant = config.variant as
        | "default"
        | "secondary"
        | "destructive"
        | "success"
        | "warning"
        | "info"
        | "outline";
      return <Badge variant={variant}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (row?.original ? <LineActions row={row} /> : "—"),
  },
];
