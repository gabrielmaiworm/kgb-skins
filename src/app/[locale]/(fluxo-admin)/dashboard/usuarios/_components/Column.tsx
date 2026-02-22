"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  Hash,
  Mail,
  User,
  Phone,
  Shield,
  Clock,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  UserPlus,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UnsortableHeader } from "@/components/table/SortableHeader";
import { DropDownItem } from "@/components/table/dropDownItem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserListItem } from "@/@types/users";
import { useAllUsersQuery } from "@/querys/users/all";
import { deleteUserAction } from "@/app/actions/users/delete-user";
import { useColumns } from "@/context/ColumnsContext";
import { toast } from "sonner";

type UserRowType = {
  row: {
    original: UserListItem;
  };
};

export const LineActions: React.FC<UserRowType> = ({ row }) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const { invalidateQuery } = useAllUsersQuery();
  const { setIsUpdateDialogOpen, setItemToUpdate, setErrorMessage, setSuccessMessage } = useColumns();
  const item = row;

  if (!row?.original) {
    return null;
  }

  function handleEditar() {
    setItemToUpdate(item.original);
    setIsUpdateDialogOpen(true);
    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleDelete() {
    try {
      setIsPending(true);
      const response = await deleteUserAction(item.original.id);
      if (!response.success) {
        throw new Error(response.message);
      }
      setIsPending(false);
      setIsDeleteDialogOpen(false);
      toast.success("Usuário deletado com sucesso");
      invalidateQuery();
    } catch {
      setIsPending(false);
      toast.error("Erro ao deletar o usuário");
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
          <DropdownMenuItem
            onClick={() => router.push(`/pt/dashboard/usuarios/${item.original.id}/convidados`)}
            className="cursor-pointer"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Ver convidados
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push(`/pt/dashboard/usuarios/${item.original.id}/orders`)}
            className="cursor-pointer"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Ver pedidos
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropDownItem onClick={handleEditar}>Editar usuário</DropDownItem>
          <DropdownMenuSeparator />
          <DropDownItem end onClick={() => setIsDeleteDialogOpen(true)}>
            Deletar usuário
          </DropDownItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar o usuário (<b>{item.original.name}</b>)?
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

export const tableColumns: ColumnDef<UserListItem>[] = [
  { accessorKey: "id", header: (props) => <UnsortableHeader {...props} columnKey="id" title="ID" icon={Hash} /> },
  {
    accessorKey: "name",
    header: (props) => <UnsortableHeader {...props} columnKey="name" title="Nome" icon={User} />,
  },
  {
    accessorKey: "email",
    header: (props) => <UnsortableHeader {...props} columnKey="email" title="E-mail" icon={Mail} />,
  },
  {
    accessorKey: "phone",
    header: (props) => <UnsortableHeader {...props} columnKey="phone" title="Telefone" icon={Phone} />,
  },
  {
    accessorKey: "role",
    header: (props) => <UnsortableHeader {...props} columnKey="role" title="Função" icon={Shield} />,
    cell: ({ getValue }) => {
      const role = getValue() as string;
      const roleMap: Record<string, string> = {
        USER: "Usuário",
        ADMIN: "Administrador",
      };
      return roleMap[role] || role;
    },
  },
  {
    accessorKey: "isActive",
    header: (props) => <UnsortableHeader {...props} columnKey="isActive" title="Ativo" icon={CheckCircle} />,
    cell: ({ getValue }) => {
      const isActive = getValue() as boolean;
      return isActive ? (
        <span className="inline-flex items-center gap-1 text-green-600">
          <CheckCircle className="h-4 w-4" /> Sim
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
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
        ? "-"
        : date.toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" });
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
