"use client";

import React from "react";
import PaginationControler from "../ui/pagination";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSort } from "@/context/SortContext";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { useColumns } from "@/context/ColumnsContext";
import { FaTimes } from "react-icons/fa";
import { Search, Download } from "lucide-react";
import { MdClearAll } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  nameFilter?: string;
  dataFilter?: string;
  totalItemsPage?: number;
  setPagination: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
      totalItems: number;
    }>
  >;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  loading: boolean;
  OtherButtons?: React.ComponentType<{ table: any }> | null;
  resetFilters?: () => void;
  pdfColumnIds?: string[];
  pdfTitle?: string;
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  nameFilter,
  pagination,
  totalItemsPage,
  setPagination,
  OtherButtons,
  resetFilters,
  loading,
  pdfColumnIds,
  pdfTitle,
  setSearchTerm,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [inputValueState, setInputValueState] = React.useState<string>("");
  const { deleteValues, setCategory, setTitle, title } = useSort();
  const [columnVisibility, setColumnVisibility] = React.useState<{
    [key: string]: boolean;
  }>({});

  const [tablePagination, setTablePagination] = React.useState({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  React.useEffect(() => {
    setTablePagination({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (setSearchTerm) setSearchTerm(inputValueState);
      setTitle(inputValueState);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValueState, setTitle]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      pagination: tablePagination,
    },
    onPaginationChange: (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        setTablePagination((prev) => {
          const next = updaterOrValue(prev);
          setPagination((old) => ({ ...old, pageIndex: next.pageIndex, pageSize: next.pageSize }));
          return next;
        });
      } else {
        setTablePagination(updaterOrValue);
        setPagination((old) => ({ ...old, pageIndex: updaterOrValue.pageIndex, pageSize: updaterOrValue.pageSize }));
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  const { errorMessage } = useColumns();

  function renderCellValue(cell: any) {
    // Lista de IDs de colunas que devem ignorar a formatação automática
    const skipFormattingColumns = ["image_url", "imageUrl", "installation_image", "images"];

    // Verifica se esta coluna está na lista de exclusão
    if (skipFormattingColumns.includes(cell.column.id)) {
      return flexRender(cell.column.columnDef.cell, cell.getContext());
    }

    const value = cell.getValue() as string;

    // Formatação apenas para datas ISO
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/;
    if (typeof value === "string" && isoDateRegex.test(value)) {
      const date = new Date(value);
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    // Truncamento para textos longos
    if (value && value.length > 45) {
      return (
        <div className="truncated-text" onClick={() => alert(value)}>
          {value.substring(0, 45) + "..."}
        </div>
      );
    }

    // Renderização padrão
    return flexRender(cell.column.columnDef.cell, cell.getContext());
  }

  function handleDownloadCSV() {
    if (!data || data.length === 0) return;
    const visibleColumns = table
      .getAllColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          (col.id !== "actions" || col.id.includes("other_action")) &&
          col.columnDef &&
          (col.columnDef as any).accessorKey
      );
    if (visibleColumns.length === 0) return;
    // Cabeçalhos
    const headers = visibleColumns.map((col) => {
      const header = col.columnDef.header;
      if (typeof header === "string") return header;
      if (typeof header === "function") {
        return col.id;
      }
      return col.id;
    });
    const rows = data.map((row) =>
      visibleColumns.map((col) => {
        const accessorKey = (col.columnDef as any).accessorKey as string;
        let value = accessorKey ? (row as any)[accessorKey] : "";
        if (typeof value === "string") {
          value = value.replace(/\n/g, " ").replace(/"/g, '""');
        }
        return `"${value ?? ""}"`;
      })
    );
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "dados.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="w-full ">
      <div className="flex flex-wrap items-center w-full gap-2 mb-2">
        {nameFilter && (
          <>
            <form
              onSubmit={(evt) => {
                evt.preventDefault();
              }}
              className="relative w-full min-w-[20rem]"
            >
              <Input
                id="user-search"
                className="h-[2.125rem] w-full"
                placeholder="Pesquisar por nome"
                onChange={(e) => setInputValueState(e.target.value)}
                value={inputValueState}
              />
              {inputValueState && (
                <Button
                  size={"sm"}
                  type="button"
                  className="h-full absolute right-28 top-0 rounded-l-lg"
                  variant={"outline"}
                  onClick={() => {
                    setInputValueState("");
                    setTitle("");
                  }}
                  aria-label="Limpar pesquisa"
                >
                  <FaTimes className="h-4 w-4" />
                </Button>
              )}
              <Button
                size={"sm"}
                className="absolute right-0 top-0 h-full"
                variant={"outline"}
                type="submit"
                onClick={() => {
                  setTitle(title);
                }}
              >
                {<Search className="h-4 w-4" />}
                {"Pesquisar"}
              </Button>
            </form>
            <Button
              size={"sm"}
              id="clean-filters"
              variant={"outline"}
              onClick={() => {
                setInputValueState("");
                setTitle("");
                setCategory("");
                deleteValues();
                resetFilters?.();
              }}
            >
              <>
                <MdClearAll className="h-4 w-4 " />
                Limpar filtros
              </>
            </Button>
            <Button
              size={"sm"}
              variant="outline"
              onClick={handleDownloadCSV}
              className="flex items-center"
              title="Baixar CSV"
            >
              <Download className="h-4 w-4 " />
              Baixar CSV
            </Button>
            {/* {pdfColumnIds && pdfTitle && (
              <Button variant="outline" onClick={handleDownloadPDF} className="flex items-center" title="Baixar PDF">
                <Download className="h-4 w-4 rotate-90" />
                Baixar PDF
              </Button>
            )} */}
            <DataTableViewOptions table={table} />
            {OtherButtons && <OtherButtons table={table} />}
          </>
        )}
      </div>
      <div className="rounded-md ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              // Skeleton de carregamento com base no tamanho da página atual
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={`skeleton-row-${index}`}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={`skeleton-cell-${index}-${cellIndex}`}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              // Dados carregados com sucesso
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={index % 2 === 0 ? "" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === "actions" ||
                      cell.column.id.includes("other_action") ||
                      cell.column.id === "select"
                        ? flexRender(cell.column.columnDef.cell, cell.getContext())
                        : cell.getValue() === null || cell.getValue() === undefined || cell.getValue() === ""
                          ? "-"
                          : renderCellValue(cell)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Sem dados ou erro
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  {errorMessage ? (
                    <div className="flex flex-col items-start space-y-2 text-destructive">
                      <span className="font-medium">Erro ao carregar dados</span>
                      <span className="text-sm">{errorMessage}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-start w-full mr-auto">Nenhum dado encontrado.</span>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="pt-4">
        <div className="flex items-center justify-center space-x-2">
          {loading ? (
            <div className="flex gap-2 items-center">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          ) : totalItemsPage && totalItemsPage > 0 ? (
            <PaginationControler
              currentPage={pagination?.pageIndex}
              itemsPerPage={pagination?.pageSize}
              totalItems={totalItemsPage}
              setQueryPagination={setPagination}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
