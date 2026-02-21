"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Hash,
  Calendar,
  FileText,
  Tag,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UnsortableHeader } from "@/components/table/SortableHeader";
import { DropDownItem } from "@/components/table/dropDownItem";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChangelogItem } from "@/@types/changelog";

type ChangelogRowType = {
  row: {
    original: ChangelogItem;
  };
};

function getTypeBadgeClass(type: string) {
  switch (type) {
    case "FEATURE":
      return "bg-success-10 text-success";
    case "SUPPORT":
      return "bg-info-10 text-info";
    case "BUGFIX":
      return "bg-destructive-10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "FEATURE":
      return "Funcionalidade";
    case "SUPPORT":
      return "Suporte";
    case "BUGFIX":
      return "Correção";
    default:
      return type;
  }
}

export const LineActions: React.FC<ChangelogRowType> = ({ row }) => {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  if (!row?.original) {
    return null;
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
          <DropDownItem end onClick={() => setIsDetailsOpen(true)}>
            Ver detalhes
          </DropDownItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{row.original.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getTypeBadgeClass(row.original.type)}`}>
                {getTypeLabel(row.original.type)}
              </span>
              <span className="body-caption text-text-muted">
                {new Date(row.original.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="body-paragraph text-foreground whitespace-pre-wrap">{row.original.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const tableColumns: ColumnDef<ChangelogItem>[] = [
  {
    accessorKey: "id",
    header: (props) => <UnsortableHeader {...props} columnKey="id" title="ID" icon={Hash} />,
    cell: ({ getValue }) => {
      const id = getValue() as string;
      return id?.length > 8 ? `${id.substring(0, 8)}...` : id;
    },
  },
  {
    accessorKey: "date",
    header: (props) => <UnsortableHeader {...props} columnKey="date" title="Data" icon={Calendar} />,
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return date
        ? new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—";
    },
  },
  {
    accessorKey: "title",
    header: (props) => <UnsortableHeader {...props} columnKey="title" title="Título" icon={FileText} />,
    cell: ({ getValue }) => {
      const title = getValue() as string;
      return title?.length > 40 ? `${title.substring(0, 40)}...` : title || "—";
    },
  },
  {
    accessorKey: "type",
    header: (props) => <UnsortableHeader {...props} columnKey="type" title="Tipo" icon={Tag} />,
    cell: ({ getValue }) => {
      const type = getValue() as string;
      return (
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${getTypeBadgeClass(type)}`}>
          {getTypeLabel(type)}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: (props) => <UnsortableHeader {...props} columnKey="description" title="Descrição" icon={FileText} />,
    cell: ({ getValue }) => {
      const desc = getValue() as string;
      return desc?.length > 50 ? `${desc.substring(0, 50)}...` : desc || "—";
    },
  },
  {
    accessorKey: "createdAt",
    header: (props) => <UnsortableHeader {...props} columnKey="createdAt" title="Criado em" icon={Clock} />,
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (row?.original ? <LineActions row={row} /> : "—"),
  },
];
