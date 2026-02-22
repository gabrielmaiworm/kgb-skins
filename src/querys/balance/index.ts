"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserBalance } from "@/@types/balance";
import { getUserBalanceAction } from "@/app/actions/balance/gets";

const USER_BALANCE = ["user", "balance"];

const emptyBalance: UserBalance = {
  availableBalance: 0,
  pendingBalance: 0,
  pendingBalanceExpiresAt: null,
};

export function useBalanceQuery(enabled: boolean = true) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading = true,
    error,
    refetch,
  } = useQuery<UserBalance>({
    queryKey: USER_BALANCE,
    queryFn: async () => {
      try {
        const result = await getUserBalanceAction();
        if (result.responseData) {
          return result.responseData as UserBalance;
        }
        return emptyBalance;
      } catch (_e) {
        toast.error("Erro ao buscar saldo");
        return emptyBalance;
      }
    },
    enabled,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: USER_BALANCE });
  }, [queryClient]);

  return {
    data: data ?? emptyBalance,
    isLoading,
    error,
    refetch,
    invalidateQuery,
  };
}
