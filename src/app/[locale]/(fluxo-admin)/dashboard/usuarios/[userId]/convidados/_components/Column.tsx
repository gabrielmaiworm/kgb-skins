"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Hash, User, Mail, Phone, Gift, Clock } from "lucide-react";
import { UnsortableHeader } from "@/components/table/SortableHeader";
import { InvitedUserItem } from "@/@types/users";

export const tableColumns: ColumnDef<InvitedUserItem>[] = [
  {
    accessorKey: "id",
    header: (props) => <UnsortableHeader {...props} columnKey="id" title="ID" icon={Hash} />,
    cell: ({ getValue }) => {
      const id = getValue() as string;
      return id?.length > 8 ? `${id.substring(0, 8)}...` : id;
    },
  },
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
    header: (props) => <UnsortableHeader {...props} columnKey="inviteCode" title="Código" icon={Gift} />,
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
    accessorKey: "createdAt",
    header: (props) => <UnsortableHeader {...props} columnKey="createdAt" title="Cadastrado em" icon={Clock} />,
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
];
