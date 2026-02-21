"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GetCampaignByIdResponse } from "@/@types/campaings";
import { getCampaignByIdAction } from "@/app/actions/campaings/gets";

const CAMPAING_BY_ID = ["campaings", "byId"];

export function useCampaingByIdQuery(campaignId: string, activatedCache: boolean = false) {
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
  } = useQuery<GetCampaignByIdResponse>({
    queryKey: [...CAMPAING_BY_ID, campaignId, contextInvalidateKey],
    queryFn: async () => {
      const emptyResponse = {} as GetCampaignByIdResponse;
      try {
        const result = await getCampaignByIdAction(campaignId);
        if (result.responseData) {
          return result.responseData as GetCampaignByIdResponse;
        }
        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar campanha");
        return emptyResponse;
      }
    },
    enabled: !!campaignId,
    staleTime: activatedCache ? 1000 * 60 * 3 : 0,
    gcTime: activatedCache ? 1000 * 60 * 3 : 0,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: CAMPAING_BY_ID });
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
