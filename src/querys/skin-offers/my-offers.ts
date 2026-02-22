"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListMySkinOffersResponse } from "@/@types/skin-offers";
import { listMySkinOffersAction } from "@/app/actions/skin-offers/gets";

const MY_SKIN_OFFERS = ["skin-offers", "my-offers"];

const emptyResponse: ListMySkinOffersResponse = {
  items: [],
  page: 1,
  totalPages: 0,
  totalItems: 0,
  itemsPerPage: 10,
};

export function useMySkinOffersQuery(enabled: boolean = true) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading = true,
    error,
    refetch,
  } = useQuery<ListMySkinOffersResponse>({
    queryKey: MY_SKIN_OFFERS,
    queryFn: async () => {
      try {
        const result = await listMySkinOffersAction();
        if (result.responseData) {
          return result.responseData as ListMySkinOffersResponse;
        }
        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar suas ofertas");
        return emptyResponse;
      }
    },
    enabled,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: MY_SKIN_OFFERS });
  }, [queryClient]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidateQuery,
  };
}
