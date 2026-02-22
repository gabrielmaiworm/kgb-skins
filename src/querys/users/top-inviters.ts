"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TopInvitersRequest, TopInvitersResponse } from "@/@types/users";
import { getTopInvitersAction } from "@/app/actions/users/gets";

const TOP_INVITERS = ["users", "top-inviters"];

export function useTopInvitersQuery(activatedCache: boolean = false) {
  const queryClient = useQueryClient();
  const [contextInvalidateKey, setContextInvalidateKey] = React.useState(0);
  const [pagination, setPagination] = React.useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
  });
  const invalidateContext = React.useCallback(() => {
    setContextInvalidateKey((k) => k + 1);
  }, []);

  const {
    data,
    isLoading = true,
    error,
    refetch,
  } = useQuery<TopInvitersResponse>({
    queryKey: [...TOP_INVITERS, pagination, contextInvalidateKey],
    queryFn: async () => {
      const emptyResponse: TopInvitersResponse = {
        items: [],
        page: 1,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 0,
      };

      try {
        const params: TopInvitersRequest = {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
        };

        const result = await getTopInvitersAction(params ?? {});

        if (result.responseData) {
          setPagination((prev) => ({
            ...prev,
            totalItems: result.responseData?.totalItems || 0,
            pageIndex: result.responseData?.page || 1,
            pageSize: result.responseData?.itemsPerPage || 10,
          }));

          return result.responseData as TopInvitersResponse;
        }

        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar top convidadores");
        return emptyResponse;
      }
    },
    enabled: true,
    staleTime: activatedCache ? 1000 * 60 * 3 : 0,
    gcTime: activatedCache ? 1000 * 60 * 3 : 0,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: TOP_INVITERS });
  }, [queryClient]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidateQuery,
    invalidateContext,
    pagination,
    setPagination,
  };
}
