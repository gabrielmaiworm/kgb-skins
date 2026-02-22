// User Balance Types

export interface UserBalance {
  availableBalance: number;
  pendingBalance: number;
  pendingBalanceExpiresAt: string | null;
}
