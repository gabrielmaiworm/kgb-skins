"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListChangelogRequest, ListChangelogResponse } from "@/@types/changelog";
import { listChangelogAction } from "@/app/actions/changelog/gets";

const CHANGELOG_ALL = ["changelog", "all"];

export function useAllChangelogQuery(activatedCache: boolean = false) {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = React.useState({
    pageIndex: 1,
    pageSize: 100,
    totalItems: 0,
  });

  const {
    data,
    isLoading = true,
    error,
    refetch,
  } = useQuery<ListChangelogResponse>({
    queryKey: [...CHANGELOG_ALL, pagination],
    queryFn: async () => {
      const emptyResponse: ListChangelogResponse = {
        items: [],
        page: 1,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 0,
      };

      try {
        const params: ListChangelogRequest = {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
        };

        const result = await listChangelogAction(params ?? {});

        if (result.responseData) {
          return result.responseData as ListChangelogResponse;
        }

        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar changelog");
        return emptyResponse;
      }
    },
    enabled: true,
    staleTime: activatedCache ? 1000 * 60 * 3 : 0,
    gcTime: activatedCache ? 1000 * 60 * 3 : 0,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: CHANGELOG_ALL });
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
    pagination: paginationWithTotal,
    setPagination,
  };
}
