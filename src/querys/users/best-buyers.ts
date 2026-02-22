"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BestBuyersRequest, BestBuyersResponse } from "@/@types/users";
import { getBestBuyersAction } from "@/app/actions/users/gets";

const BEST_BUYERS = ["users", "best-buyers"];

export function useBestBuyersQuery(activatedCache: boolean = false) {
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
  } = useQuery<BestBuyersResponse>({
    queryKey: [...BEST_BUYERS, pagination, contextInvalidateKey],
    queryFn: async () => {
      const emptyResponse: BestBuyersResponse = {
        items: [],
        page: 1,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 0,
      };

      try {
        const params: BestBuyersRequest = {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
        };

        const result = await getBestBuyersAction(params ?? {});

        if (result.responseData) {
          setPagination((prev) => ({
            ...prev,
            totalItems: result.responseData?.totalItems || 0,
            pageIndex: result.responseData?.page || 1,
            pageSize: result.responseData?.itemsPerPage || 10,
          }));

          return result.responseData as BestBuyersResponse;
        }

        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar maiores compradores");
        return emptyResponse;
      }
    },
    enabled: true,
    staleTime: activatedCache ? 1000 * 60 * 3 : 0,
    gcTime: activatedCache ? 1000 * 60 * 3 : 0,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: BEST_BUYERS });
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
