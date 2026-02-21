"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FindUserByIdResponse } from "@/@types/users";
import { findUserByIdAction } from "@/app/actions/users/gets";

const USER_BY_ID = ["users", "byId"];

export function useUserByIdQuery(userId: string, activatedCache: boolean = false) {
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
  } = useQuery<FindUserByIdResponse>({
    queryKey: [...USER_BY_ID, userId, contextInvalidateKey],
    queryFn: async () => {
      const emptyResponse = {} as FindUserByIdResponse;
      try {
        const result = await findUserByIdAction(userId);
        if (result.responseData) {
          return result.responseData as FindUserByIdResponse;
        }
        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar usuário");
        return emptyResponse;
      }
    },
    enabled: !!userId,
    staleTime: activatedCache ? 1000 * 60 * 3 : 0,
    gcTime: activatedCache ? 1000 * 60 * 3 : 0,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: USER_BY_ID });
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
