"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GetUserOrdersRequest, GetUserOrdersResponse } from "@/@types/campaings";
import { getCampaignOrdersByUserIdAction } from "@/app/actions/campaings/gets";

const CAMPAIGN_ORDERS_BY_USER = ["campaings", "orders", "by-user"];

const emptyResponse: GetUserOrdersResponse = {
  orders: [],
  tickets: [],
  total: 0,
  page: 1,
  limit: 10,
};

export function useCampaignOrdersByUserIdQuery(
  userId: string,
  params?: GetUserOrdersRequest,
  activatedCache: boolean = false
) {
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

  const queryParams: GetUserOrdersRequest = React.useMemo(
    () => ({ page: params?.page ?? pagination.pageIndex, limit: params?.limit ?? pagination.pageSize }),
    [params?.page, params?.limit, pagination.pageIndex, pagination.pageSize]
  );

  const {
    data,
    isLoading = true,
    error,
    refetch,
  } = useQuery<GetUserOrdersResponse>({
    queryKey: [...CAMPAIGN_ORDERS_BY_USER, userId, queryParams, contextInvalidateKey],
    queryFn: async () => {
      try {
        const result = await getCampaignOrdersByUserIdAction(userId, queryParams);

        if (result.responseData) {
          return result.responseData as GetUserOrdersResponse;
        }

        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar pedidos do usuário");
        return emptyResponse;
      }
    },
    enabled: !!userId,
    staleTime: activatedCache ? 1000 * 30 : 0,
    gcTime: activatedCache ? 1000 * 30 : 0,
  });

  React.useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        totalItems: data.total ?? 0,
        pageIndex: data.page ?? 1,
        pageSize: data.limit ?? 10,
      }));
    }
  }, [data?.total, data?.page, data?.limit]);

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: CAMPAIGN_ORDERS_BY_USER });
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
