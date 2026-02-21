"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListInvitedUsersResponse } from "@/@types/users";
import { getInvitedUsersAction } from "@/app/actions/users/gets";

const INVITED_USERS = ["users", "invited"];

export function useInvitedUsersQuery(userId: string | undefined, enabled: boolean = true) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading = true,
    error,
    refetch,
  } = useQuery<ListInvitedUsersResponse>({
    queryKey: [...INVITED_USERS, userId],
    queryFn: async () => {
      const emptyResponse: ListInvitedUsersResponse = {
        items: [],
        totalPages: 0,
        page: 1,
        totalItems: 0,
        itemsPerPage: 10,
      };

      if (!userId) return emptyResponse;

      try {
        const result = await getInvitedUsersAction(userId);

        if (result.responseData) {
          return result.responseData as ListInvitedUsersResponse;
        }

        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar usuários convidados");
        return emptyResponse;
      }
    },
    enabled: !!userId && enabled,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: INVITED_USERS });
  }, [queryClient]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidateQuery,
  };
}
