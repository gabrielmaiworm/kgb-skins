"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListSkinOffersAdminRequest, ListSkinOffersAdminResponse } from "@/@types/skin-offers";
import { listSkinOffersAdminAction } from "@/app/actions/skin-offers/gets";

const SKIN_OFFERS_ADMIN = ["skin-offers", "admin"];

const emptyResponse: ListSkinOffersAdminResponse = {
  items: [],
  page: 1,
  totalPages: 0,
  totalItems: 0,
  itemsPerPage: 10,
};

export function useSkinOffersAdminQuery() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = React.useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = React.useState("");

  const {
    data,
    isLoading = true,
    error,
    refetch,
  } = useQuery<ListSkinOffersAdminResponse>({
    queryKey: [...SKIN_OFFERS_ADMIN, pagination, searchTerm],
    queryFn: async () => {
      try {
        const params: ListSkinOffersAdminRequest = {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
          search: searchTerm || undefined,
        };
        const result = await listSkinOffersAdminAction(params);

        if (result.responseData) {
          setPagination((prev) => ({
            ...prev,
            totalItems: result.responseData?.totalItems || 0,
            pageIndex: result.responseData?.page || 1,
            pageSize: result.responseData?.itemsPerPage || 10,
          }));
          return result.responseData as ListSkinOffersAdminResponse;
        }
        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar ofertas");
        return emptyResponse;
      }
    },
    enabled: true,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: SKIN_OFFERS_ADMIN });
  }, [queryClient]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidateQuery,
    pagination,
    setPagination,
    searchTerm,
    setSearchTerm,
  };
}
