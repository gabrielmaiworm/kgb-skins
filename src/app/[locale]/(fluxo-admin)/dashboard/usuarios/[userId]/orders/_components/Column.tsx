"use client";

import React from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { ImageIcon, Ticket, DollarSign, Clock } from "lucide-react";
import { UnsortableHeader } from "@/components/table/SortableHeader";
import { MyTicket } from "@/@types/campaings";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const tableColumns: ColumnDef<MyTicket>[] = [
  {
    id: "campaign",
    accessorKey: "campaign",
    header: (props) => <UnsortableHeader {...props} columnKey="campaign" title="Campanha" icon={ImageIcon} />,
    cell: ({ row }) => {
      const campaign = row.original.campaign;
      if (!campaign) return "—";
      return (
        <div className="flex items-center gap-2 max-w-[220px]">
          {campaign.coverImage ? (
            <Image
              src={campaign.coverImage}
              alt={campaign.title}
              width={40}
              height={40}
              className="h-10 w-10 rounded object-cover shrink-0"
            />
          ) : (
            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <span className="truncate font-medium">{campaign.title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "numbers",
    header: (props) => <UnsortableHeader {...props} columnKey="numbers" title="Números" icon={Ticket} />,
    cell: ({ row }) => {
      const numbers = row.original.numbers;
      return numbers?.length ? numbers.join(", ") : "—";
    },
  },
  {
    accessorKey: "status",
    header: (props) => <UnsortableHeader {...props} columnKey="status" title="Status" icon={Ticket} />,
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const statusMap: Record<string, string> = {
        RESERVED: "Reservado",
        PAID: "Pago",
      };
      const statusColor: Record<string, string> = {
        RESERVED: "text-yellow-600",
        PAID: "text-green-600",
      };
      return <span className={statusColor[status] || ""}>{statusMap[status] || status}</span>;
    },
  },
  {
    accessorKey: "payment.amount",
    header: (props) => <UnsortableHeader {...props} columnKey="payment.amount" title="Valor" icon={DollarSign} />,
    cell: ({ row }) => {
      const amount = row.original.payment?.amount;
      if (amount == null) return "—";
      return formatBRL(amount);
    },
  },
  {
    accessorKey: "payment.paidAt",
    header: (props) => (
      <UnsortableHeader {...props} columnKey="payment.paidAt" title="Data pagamento" icon={Clock} />
    ),
    cell: ({ row }) => {
      const paidAt = row.original.payment?.paidAt;
      if (!paidAt) return "—";
      const date = new Date(paidAt);
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
