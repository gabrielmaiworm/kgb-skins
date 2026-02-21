"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Hash,
  User,
  Mail,
  Shield,
  Route,
  FileCode2,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UnsortableHeader } from "@/components/table/SortableHeader";
import { DropDownItem } from "@/components/table/dropDownItem";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogListItem } from "@/@types/logs";

type LogRowType = {
  row: {
    original: LogListItem;
  };
};

export const LineActions: React.FC<LogRowType> = ({ row }) => {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const item = row;

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
            Ver detalhes (payload)
          </DropDownItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do log</DialogTitle>
          </DialogHeader>
          <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto whitespace-pre-wrap break-all">
            {JSON.stringify(item.original.payload, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const tableColumns: ColumnDef<LogListItem>[] = [
  {
    accessorKey: "id",
    header: (props) => <UnsortableHeader {...props} columnKey="id" title="ID" icon={Hash} />,
    cell: ({ getValue }) => {
      const id = getValue() as string;
      return id?.length > 8 ? `${id.substring(0, 8)}...` : id;
    },
  },
  {
    accessorKey: "userName",
    header: (props) => <UnsortableHeader {...props} columnKey="userName" title="Usuário" icon={User} />,
    cell: ({ getValue }) => (getValue() as string | null) ?? "—",
  },
  {
    accessorKey: "userEmail",
    header: (props) => <UnsortableHeader {...props} columnKey="userEmail" title="E-mail" icon={Mail} />,
    cell: ({ getValue }) => (getValue() as string | null) ?? "—",
  },
  {
    accessorKey: "userRole",
    header: (props) => <UnsortableHeader {...props} columnKey="userRole" title="Função" icon={Shield} />,
    cell: ({ getValue }) => (getValue() as string | null) ?? "—",
  },
  {
    accessorKey: "route",
    header: (props) => <UnsortableHeader {...props} columnKey="route" title="Rota" icon={Route} />,
    cell: ({ getValue }) => {
      const route = getValue() as string;
      return route?.length > 40 ? `${route.substring(0, 40)}...` : route;
    },
  },
  {
    accessorKey: "method",
    header: (props) => <UnsortableHeader {...props} columnKey="method" title="Método" icon={FileCode2} />,
    cell: ({ getValue }) => {
      const method = getValue() as string;
      const color =
        method === "GET"
          ? "text-blue-600"
          : method === "POST"
            ? "text-green-600"
            : method === "PUT" || method === "PATCH"
              ? "text-amber-600"
              : method === "DELETE"
                ? "text-red-600"
                : "";
      return <span className={color}>{method}</span>;
    },
  },
  {
    accessorKey: "statusCode",
    header: (props) => <UnsortableHeader {...props} columnKey="statusCode" title="Status" icon={FileCode2} />,
    cell: ({ getValue }) => {
      const code = getValue() as number;
      const isOk = code >= 200 && code < 300;
      return <span className={isOk ? "text-green-600" : "text-red-600"}>{code}</span>;
    },
  },
  {
    accessorKey: "success",
    header: (props) => <UnsortableHeader {...props} columnKey="success" title="Sucesso" icon={CheckCircle} />,
    cell: ({ getValue }) => {
      const success = getValue() as boolean;
      return success ? (
        <span className="inline-flex items-center gap-1 text-green-600">
          <CheckCircle className="h-4 w-4" /> Sim
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-red-600">
          <XCircle className="h-4 w-4" /> Não
        </span>
      );
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
            second: "2-digit",
          });
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (row?.original ? <LineActions row={row} /> : "—"),
  },
];
