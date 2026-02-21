"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListInvitedUsersResponse } from "@/@types/users";
import { getMyInvitedUsersAction } from "@/app/actions/users/gets";

const MY_INVITED_USERS = ["users", "my-invited"];

export function useMyInvitedUsersQuery(enabled: boolean = true) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading = true,
    error,
    refetch,
  } = useQuery<ListInvitedUsersResponse>({
    queryKey: MY_INVITED_USERS,
    queryFn: async () => {
      const emptyResponse: ListInvitedUsersResponse = {
        items: [],
        totalPages: 0,
        page: 1,
        totalItems: 0,
        itemsPerPage: 10,
      };

      try {
        const result = await getMyInvitedUsersAction();

        if (result.responseData) {
          return result.responseData as ListInvitedUsersResponse;
        }

        return emptyResponse;
      } catch (_e) {
        toast.error("Erro ao buscar usuários convidados");
        return emptyResponse;
      }
    },
    enabled,
  });

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: MY_INVITED_USERS });
  }, [queryClient]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidateQuery,
  };
}
