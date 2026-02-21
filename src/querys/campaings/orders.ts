"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GetCampaignOrdersResponse, GetCampaignOrdersRequest } from "@/@types/campaings";
import { getCampaignOrdersAction } from "@/app/actions/campaings/gets";

const CAMPAIGN_ORDERS = ["campaings", "orders"];

export function useCampaignOrdersQuery(
  campaignId: string,
  params?: GetCampaignOrdersRequest,
  activatedCache: boolean = false
) {
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
  } = useQuery<GetCampaignOrdersResponse>({
    queryKey: [...CAMPAIGN_ORDERS, campaignId, params, contextInvalidateKey],
    queryFn: async () => {
      const emptyResponse: GetCampaignOrdersResponse = {
        orders: [],
        total: 0,
      };

      try {
        const result = await getCampaignOrdersAction(campaignId);

        if (result.responseData) {
          return result.responseData as GetCampaignOrdersResponse;
        }

        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar pedidos da campanha");
        return emptyResponse;
      }
    },
    enabled: !!campaignId,
    staleTime: activatedCache ? 1000 * 30 : 0,
    gcTime: activatedCache ? 1000 * 30 : 0,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: CAMPAIGN_ORDERS });
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
