import { AxiosResponse } from "axios";
import api from "../axiosNodeApi";
import { UserBalance } from "@/@types/balance";

const isMockEnabled = () => process.env.NEXT_PUBLIC_MOCK_SKIN_OFFERS === "true";

export async function getUserBalanceService(): Promise<AxiosResponse<UserBalance>> {
  if (isMockEnabled()) {
    const mock: UserBalance = {
      availableBalance: 0,
      pendingBalance: 0,
      pendingBalanceExpiresAt: null,
    };
    return Promise.resolve({ data: mock } as AxiosResponse<UserBalance>);
  }
  return api.get<UserBalance>("/users/me/balance");
}
