"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MyOrdersResponse, MyOrdersRequest } from "@/@types/campaings";
import { getMyOrdersAction } from "@/app/actions/campaings/gets";

const MY_ORDERS = ["campaings", "my-orders"];

export function useMyOrdersQuery(params?: MyOrdersRequest, activatedCache: boolean = false) {
  const queryClient = useQueryClient();
  const [contextInvalidateKey, setContextInvalidateKey] = React.useState(0);

  const invalidateContext = React.useCallback(() => {
    setContextInvalidateKey((k) => k + 1);
  }, []);

  const {
    data,
    isLoading = true,
    error,
    refetch,
  } = useQuery<MyOrdersResponse>({
    queryKey: [...MY_ORDERS, params, contextInvalidateKey],
    queryFn: async () => {
      const emptyResponse: MyOrdersResponse = {
        tickets: [],
        orders: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      try {
        const result = await getMyOrdersAction(params);

        if (result.responseData) {
          return result.responseData as MyOrdersResponse;
        }

        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar meus números");
        return emptyResponse;
      }
    },
    staleTime: activatedCache ? 1000 * 30 : 0,
    gcTime: activatedCache ? 1000 * 30 : 0,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: MY_ORDERS });
  }, [queryClient]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidateQuery,
    invalidateContext,
  };
}
