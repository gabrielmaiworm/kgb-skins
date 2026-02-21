"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Clock, Trophy, MoreHorizontal, DollarSign, Ticket, Calendar, Package, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UnsortableHeader } from "@/components/table/SortableHeader";
import { DropDownItem } from "@/components/table/dropDownItem";
import { useColumns } from "@/context/ColumnsContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CampaignListItem } from "@/@types/campaings";
import { useAllCampaingsQuery } from "@/querys/campaings/all";
import { deleteCampaignAction } from "@/app/actions/campaings/delete-campaing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

type CampaignType = {
  row: {
    original: CampaignListItem;
  };
};

export const LineActions: React.FC<CampaignType> = ({ row }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const { invalidateQuery } = useAllCampaingsQuery();
  const { setIsUpdateDialogOpen, setItemToUpdate, setErrorMessage, setSuccessMessage } = useColumns();
  const item = row;
  const router = useRouter();

  function atualizarItem() {
    setItemToUpdate(item.original);
    setIsUpdateDialogOpen(true);
    setSuccessMessage("");
    setErrorMessage("");
  }

  if (!row?.original) {
    return null;
  }

  async function handleDelete() {
    try {
      setIsPending(true);
      const response = await deleteCampaignAction(item.original.id);
      if (!response.success) {
        throw new Error(response.message);
      }
      setIsPending(false);
      setIsDeleteDialogOpen(false);
      toast.success("Campanha deletada com sucesso");
      invalidateQuery();
    } catch (error) {
      setIsPending(false);
      toast.error("Erro ao deletar a campanha");
    }
  }

  async function handleCopyLink() {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/pt/${item.original.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado para a área de transferência");
    } catch {
      toast.error("Erro ao copiar link");
    }
  }

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
          <DropDownItem onClick={atualizarItem}>Editar campanha</DropDownItem>
          <DropDownItem onClick={() => router.push(`/pt/dashboard/campanhas/${item.original.id}/orders`)}>
            Visualizar pedidos
          </DropDownItem>
          <DropDownItem onClick={handleCopyLink}>Copiar link da campanha</DropDownItem>
          <DropdownMenuSeparator />
          <DropDownItem end onClick={() => setIsDeleteDialogOpen(true)}>
            Deletar campanha
          </DropDownItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar campanha</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar a campanha (<b>{item.original.title}</b>)?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="btn btn-outline mr-2"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="button" variant={"destructive"} onClick={handleDelete} disabled={isPending}>
              {isPending ? "Processando..." : "Sim, deletar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" }
> = {
  PENDING: { label: "Pendente", variant: "warning" },
  ACTIVE: { label: "Ativa", variant: "success" },
  PAUSED: { label: "Pausada", variant: "secondary" },
  COMPLETED: { label: "Concluída", variant: "outline" },
  CANCELED: { label: "Cancelada", variant: "destructive" },
};

export const tableColumns: ColumnDef<CampaignListItem>[] = [
  {
    accessorKey: "title",
    header: (props) => <UnsortableHeader {...props} columnKey="title" title="Campanha" icon={Trophy} />,
    cell: ({ row }) => {
      const { title, coverImage, subtitle } = row.original;
      return (
        <div className="flex items-center gap-3 min-w-0">
          {coverImage && (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
              <Image
                src={coverImage}
                alt={title}
                width={100}
                height={100}
                quality={100}
                className="object-cover w-full h-full"
                sizes="40px"
              />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-medium truncate">{title}</span>
            {subtitle && <span className="text-xs text-muted-foreground truncate max-w-[200px]">{subtitle}</span>}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "itemPrice",
    header: (props) => <UnsortableHeader {...props} columnKey="itemPrice" title="Preço" icon={Package} />,
    cell: ({ row }) => {
      const { isFree, itemPrice } = row.original;
      if (isFree) {
        return <Badge variant="outline">Gratuito</Badge>;
      }
      return formatBRL(itemPrice);
    },
  },
  {
    accessorKey: "totalTickets",
    header: (props) => <UnsortableHeader {...props} columnKey="totalTickets" title="Tickets" icon={Ticket} />,
    cell: ({ row }) => {
      const { totalTickets, paidTicketsCount } = row.original;
      return (
        <span className="tabular-nums">
          {paidTicketsCount ?? 0}/{totalTickets}
        </span>
      );
    },
  },
  {
    accessorKey: "pricePerTicket",
    header: (props) => (
      <UnsortableHeader {...props} columnKey="pricePerTicket" title="Preço/Ticket" icon={DollarSign} />
    ),
    cell: ({ row }) => {
      const { isFree, pricePerTicket } = row.original;
      if (isFree) {
        return <Badge variant="outline">Gratuito</Badge>;
      }
      return formatBRL(pricePerTicket);
    },
  },
  {
    accessorKey: "itemCondition",
    header: (props) => <UnsortableHeader {...props} columnKey="itemCondition" title="Condição" icon={Tag} />,
    cell: ({ getValue }) => (getValue() as string) || "-",
  },
  {
    accessorKey: "drawDate",
    header: (props) => <UnsortableHeader {...props} columnKey="drawDate" title="Data Sorteio" icon={Calendar} />,
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return isNaN(date.getTime())
        ? "-"
        : date.toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" });
    },
  },
  {
    accessorKey: "status",
    header: (props) => <UnsortableHeader {...props} columnKey="status" title="Status" icon={Clock} />,
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const config = statusConfig[status] || { label: status, variant: "outline" as const };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return row?.original ? <LineActions row={row} /> : "...";
    },
  },
];
