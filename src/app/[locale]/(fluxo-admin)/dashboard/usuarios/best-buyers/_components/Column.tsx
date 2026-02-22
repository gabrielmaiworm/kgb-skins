"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { User, Mail, Phone, DollarSign, MoreHorizontal, UserPlus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UnsortableHeader } from "@/components/table/SortableHeader";
import { BestBuyerItem } from "@/@types/users";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function BestBuyerLineActions({ row }: { row: { original: BestBuyerItem } }) {
  const router = useRouter();
  const item = row.original;
  const userId = item.user?.id;
  if (!userId) return null;
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
          onClick={() => router.push(`/pt/dashboard/usuarios/${userId}/convidados`)}
          className="cursor-pointer"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Ver convidados
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/pt/dashboard/usuarios/${userId}/orders`)}
          className="cursor-pointer"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ver pedidos
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const tableColumns: ColumnDef<BestBuyerItem>[] = [
  {
    accessorKey: "user.name",
    header: (props) => <UnsortableHeader {...props} columnKey="user.name" title="Nome" icon={User} />,
    cell: ({ row }) => row.original.user?.name ?? "—",
  },
  {
    accessorKey: "user.email",
    header: (props) => <UnsortableHeader {...props} columnKey="user.email" title="E-mail" icon={Mail} />,
    cell: ({ row }) => row.original.user?.email ?? "—",
  },
  {
    accessorKey: "user.phone",
    header: (props) => <UnsortableHeader {...props} columnKey="user.phone" title="Telefone" icon={Phone} />,
    cell: ({ row }) => row.original.user?.phone ?? "—",
  },
  {
    accessorKey: "totalSpent",
    header: (props) => <UnsortableHeader {...props} columnKey="totalSpent" title="Total gasto" icon={DollarSign} />,
    cell: ({ row }) => formatBRL(row.original.totalSpent ?? 0),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <BestBuyerLineActions row={row} />,
  },
];
