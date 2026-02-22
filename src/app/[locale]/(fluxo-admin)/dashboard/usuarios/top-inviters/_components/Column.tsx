"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { User, Mail, Phone, Gift, Users, MoreHorizontal, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UnsortableHeader } from "@/components/table/SortableHeader";
import { TopInviterItem } from "@/@types/users";

function TopInviterLineActions({ row }: { row: { original: TopInviterItem } }) {
  const router = useRouter();
  const item = row.original;
  if (!item) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/pt/dashboard/usuarios/${item.id}/convidados`)}
          className="cursor-pointer"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Ver convidados
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const tableColumns: ColumnDef<TopInviterItem>[] = [
  {
    accessorKey: "name",
    header: (props) => <UnsortableHeader {...props} columnKey="name" title="Nome" icon={User} />,
  },
  {
    accessorKey: "email",
    header: (props) => <UnsortableHeader {...props} columnKey="email" title="E-mail" icon={Mail} />,
    cell: ({ getValue }) => (getValue() as string | null) ?? "—",
  },
  {
    accessorKey: "phone",
    header: (props) => <UnsortableHeader {...props} columnKey="phone" title="Telefone" icon={Phone} />,
    cell: ({ getValue }) => (getValue() as string | null) ?? "—",
  },
  {
    accessorKey: "inviteCode",
    header: (props) => <UnsortableHeader {...props} columnKey="inviteCode" title="Código Convite" icon={Gift} />,
    cell: ({ getValue }) => {
      const code = getValue() as string;
      return code ? (
        <code className="body-callout font-mono text-kgb-gold bg-kgb-gold/10 px-2 py-0.5 rounded">{code}</code>
      ) : (
        "—"
      );
    },
  },
  {
    accessorKey: "invitedCount",
    header: (props) => <UnsortableHeader {...props} columnKey="invitedCount" title="Convites" icon={Users} />,
    cell: ({ getValue }) => (getValue() as number) ?? 0,
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <TopInviterLineActions row={row} />,
  },
];
