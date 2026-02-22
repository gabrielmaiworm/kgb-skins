"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DashboardResponse } from "@/@types/dashboard";
import { getDashboardAction } from "@/app/actions/dashboard/gets";

const DASHBOARD = ["dashboard"];

export function useDashboardQuery(activatedCache: boolean = false) {
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
  } = useQuery<DashboardResponse>({
    queryKey: [...DASHBOARD, contextInvalidateKey],
    queryFn: async () => {
      const emptyResponse: DashboardResponse = {
        totalCampaigns: 0,
        totalUsers: 0,
        usersWithPurchases: 0,
        totalCampaignRevenue: 0,
        totalMaintenanceValue: 0,
        netRevenue: 0,
      };

      try {
        const result = await getDashboardAction();

        if (result.responseData) {
          return result.responseData as DashboardResponse;
        }

        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar métricas do dashboard");
        return emptyResponse;
      }
    },
    enabled: true,
    staleTime: activatedCache ? 1000 * 60 * 3 : 0,
    gcTime: activatedCache ? 1000 * 60 * 3 : 0,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: DASHBOARD });
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
