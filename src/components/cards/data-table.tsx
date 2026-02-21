"use client";
import { TerminalIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SimpleTitleIcon } from "../ui/title-icon";
import { DataTable } from "../table/data-table";
import { useSidebar } from "../ui/sidebar";
import { useSort } from "@/context/SortContext";
import { ColumnDef } from "@tanstack/react-table";

interface DataTableCardProps {
  columns: ColumnDef<any>[];
  isLoading: boolean;
  data: any;
  otherButtons: React.ComponentType<{ table: any }> | null;
  infos: {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
  };
  resetFilters?: () => void;
  setQueryPagination?: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
      totalItems: number;
    }>
  >;
  queryPagination?: {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
  };
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
}

export const DataTableCard = ({
  columns,
  isLoading,
  data,
  otherButtons,
  infos,
  resetFilters,
  setQueryPagination,
  queryPagination,
  setSearchTerm,
}: DataTableCardProps) => {
  const { open, isMobile } = useSidebar();
  const { pagination, setPagination } = useSort();

  const icon = infos?.icon || TerminalIcon;
  return (
    <Card
      className={` ${isMobile ? "max-w-[calc(100vw-32px)] overflow-x-hidden" : open ? "max-w-[calc(100vw-300px)]" : "max-w-[calc(100vw-92px)]"} 
            w-full overflow-x-hidden`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <SimpleTitleIcon icon={icon} title={infos.title} description={infos.description} />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <DataTable
          columns={columns}
          loading={isLoading}
          data={data || []}
          nameFilter="name"
          pagination={queryPagination || pagination}
          setPagination={setQueryPagination || setPagination}
          totalItemsPage={queryPagination ? queryPagination.totalItems : pagination.totalItems}
          OtherButtons={otherButtons}
          resetFilters={resetFilters}
          setSearchTerm={setSearchTerm}
        />
      </CardContent>
    </Card>
  );
};
