"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListCampaignsRequest, ListCampaignsResponse } from "@/@types/campaings";
import { listCampaingsAction } from "@/app/actions/campaings/gets";

const CAMPAINGS_ALL = ["campaings", "all"];

export function useAllCampaingsQuery(activatedCache: boolean = false) {
  const queryClient = useQueryClient();
  const [contextInvalidateKey, setContextInvalidateKey] = React.useState(0);
  const [pagination, setPagination] = React.useState({
    pageIndex: 1,
    pageSize: 10,
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
  } = useQuery<ListCampaignsResponse>({
    queryKey: [...CAMPAINGS_ALL, pagination, searchTerm, contextInvalidateKey],
    queryFn: async () => {
      const emptyResponse: ListCampaignsResponse = {
        items: [],
        page: 1,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 0,
      };

      try {
        const params: ListCampaignsRequest = {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
          search: searchTerm,
        };

        const result = await listCampaingsAction(params ?? {});

        if (result.responseData) {
          setPagination((prev) => ({
            ...prev,
            totalItems: result.responseData?.totalItems || 0,
            pageIndex: result.responseData?.page || 1,
            pageSize: result.responseData?.itemsPerPage || 10,
          }));

          return result.responseData as ListCampaignsResponse;
        }

        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar lista de campanhas");
        return emptyResponse;
      }
    },
    enabled: true,
    staleTime: activatedCache ? 1000 * 60 * 3 : 0,
    gcTime: activatedCache ? 1000 * 60 * 3 : 0,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: CAMPAINGS_ALL });
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
    searchTerm,
    setSearchTerm,
  };
}
