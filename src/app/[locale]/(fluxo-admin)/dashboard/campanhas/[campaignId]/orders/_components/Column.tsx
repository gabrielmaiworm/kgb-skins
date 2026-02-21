"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Hash,
  User,
  Mail,
  Phone,
  DollarSign,
  Clock,
  Ticket,
  CreditCard,
  Undo2,
  Eye,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GroupedOrderAdmin } from "@/@types/campaings";
import { UnsortableHeader } from "@/components/table/SortableHeader";
import { refoundPaymentAction } from "@/app/actions/payments";
import { useCampaignOrdersAdminQuery } from "@/querys/campaings/orders-admin";
import { useParams } from "next/navigation";

type OrderType = {
  row: {
    original: GroupedOrderAdmin;
  };
};

export const LineActions: React.FC<OrderType> = ({ row }) => {
  const router = useRouter();
  const item = row;
  const { campaignId } = useParams<{ campaignId: string }>();
  const { invalidateQuery } = useCampaignOrdersAdminQuery(campaignId ?? "");

  if (!row?.original) {
    return null;
  }

  async function handleRefundPayment() {
    if (!item.original.payment?.id) return;
    try {
      const response = await refoundPaymentAction(item.original.payment.id);
      if (response.success) {
        toast.success(response.message);
        invalidateQuery();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao estornar pagamento.");
    }
  }

  async function handleViewUserPayments() {
    // Função mockada para visualizar pagamentos do usuário
    toast.info("Visualizar pagamentos do usuário", {
      description: `Funcionalidade em desenvolvimento. Usuário: ${item?.original.user?.name ?? "—"}`,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            const userId = item.original.user?.id;
            if (userId) router.push(`/pt/dashboard/usuarios/${userId}/convidados`);
          }}
          className="cursor-pointer"
        >
          <UserPlus className="mr-2 size-4" />
          Ver convidados do usuário
        </DropdownMenuItem>
        {item.original.payment?.id && <DropdownMenuSeparator />}
        {item.original.payment?.id && (
          <DropdownMenuItem onClick={handleRefundPayment} className="cursor-pointer">
            <Undo2 className="mr-2 size-4" />
            Estornar Pagamento
          </DropdownMenuItem>
        )}
        {item.original.payment?.id && <DropdownMenuSeparator />}
        <DropdownMenuItem onClick={handleViewUserPayments} className="cursor-pointer">
          <Eye className="mr-2 size-4" />
          Ver Pagamentos do Usuário
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const tableColumns: ColumnDef<GroupedOrderAdmin>[] = [
  {
    accessorKey: "id",
    header: (props) => <UnsortableHeader {...props} columnKey="id" title="ID" icon={Hash} />,
    cell: ({ getValue }) => {
      const id = getValue() as string;
      return id?.length > 8 ? `${id.substring(0, 8)}...` : id;
    },
  },
  {
    accessorKey: "numbers",
    header: (props) => <UnsortableHeader {...props} columnKey="numbers" title="Números do Ticket" icon={Ticket} />,
    cell: ({ row }) => {
      const numbers = row.original.numbers;
      return numbers?.length ? numbers.join(", ") : "—";
    },
  },
  {
    accessorKey: "user.name",
    header: (props) => <UnsortableHeader {...props} columnKey="user.name" title="Usuário" icon={User} />,
    cell: ({ row }) => row.original.user?.name ?? "—",
  },
  {
    accessorKey: "user.email",
    header: (props) => <UnsortableHeader {...props} columnKey="user.email" title="Email" icon={Mail} />,
    cell: ({ row }) => row.original.user?.email ?? "—",
  },
  {
    accessorKey: "user.phone",
    header: (props) => <UnsortableHeader {...props} columnKey="user.phone" title="Telefone" icon={Phone} />,
    cell: ({ row }) => row.original.user?.phone ?? "—",
  },
  {
    accessorKey: "payment.amount",
    header: (props) => <UnsortableHeader {...props} columnKey="payment.amount" title="Valor" icon={DollarSign} />,
    cell: ({ row }) => {
      const amount = row.original.payment?.amount;
      if (amount == null) return "—";
      return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
    },
  },
  {
    accessorKey: "status",
    header: (props) => <UnsortableHeader {...props} columnKey="status" title="Status Ticket" icon={Ticket} />,
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
    accessorKey: "payment.status",
    header: (props) => (
      <UnsortableHeader {...props} columnKey="payment.status" title="Status Pagamento" icon={CreditCard} />
    ),
    cell: ({ row }) => {
      const status = row.original.payment?.status;
      if (!status) return "—";
      const statusMap: Record<string, string> = {
        PENDING: "Pendente",
        CONFIRMED: "Confirmado",
        PAID: "Pago",
        EXPIRED: "Expirado",
        FAILED: "Falhou",
      };
      const statusColor: Record<string, string> = {
        PENDING: "text-yellow-600",
        CONFIRMED: "text-green-600",
        PAID: "text-green-600",
        EXPIRED: "text-red-600",
        FAILED: "text-red-600",
      };
      return <span className={statusColor[status] || ""}>{statusMap[status] || status}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: (props) => <UnsortableHeader {...props} columnKey="createdAt" title="Criado em" icon={Clock} />,
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return isNaN(date.getTime())
        ? "-"
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
    cell: ({ row }) => {
      return row?.original ? <LineActions row={row} /> : "...";
    },
  },
];
