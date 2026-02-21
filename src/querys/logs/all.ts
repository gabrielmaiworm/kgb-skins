"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListLogsRequest, ListLogsResponse } from "@/@types/logs";
import { listLogsAction } from "@/app/actions/logs/gets";

const LOGS_ALL = ["logs", "all"];

export function useAllLogsQuery(activatedCache: boolean = false) {
  const queryClient = useQueryClient();
  const [contextInvalidateKey, setContextInvalidateKey] = React.useState(0);
  const [pagination, setPagination] = React.useState({
    pageIndex: 1,
    pageSize: 100,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = React.useState("");
  const invalidateContext = React.useCallback(() => {
    setContextInvalidateKey((k) => k + 1);
  }, []);

  const {
    data,
    isLoading = true,
    error,
    refetch,
  } = useQuery<ListLogsResponse>({
    queryKey: [...LOGS_ALL, pagination, searchTerm, contextInvalidateKey],
    queryFn: async () => {
      const emptyResponse: ListLogsResponse = {
        items: [],
        page: 1,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 0,
      };

      try {
        const params: ListLogsRequest = {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
          ...(searchTerm ? { name: searchTerm } : {}),
        };

        const result = await listLogsAction(params ?? {});

        if (result.responseData) {
          return result.responseData as ListLogsResponse;
        }

        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar lista de logs");
        return emptyResponse;
      }
    },
    enabled: true,
    staleTime: activatedCache ? 1000 * 60 * 3 : 0,
    gcTime: activatedCache ? 1000 * 60 * 3 : 0,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: LOGS_ALL });
  }, [queryClient]);

  const paginationWithTotal = React.useMemo(
    () => ({
      ...pagination,
      totalItems: data?.totalItems ?? pagination.totalItems,
    }),
    [pagination, data?.totalItems]
  );

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidateQuery,
    invalidateContext,
    pagination: paginationWithTotal,
    setPagination,
    searchTerm,
    setSearchTerm,
  };
}
