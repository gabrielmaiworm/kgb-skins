"use server";

import { getUserBalanceService } from "@/services/balance";
import { baseGetAction } from "../base-get-actions";
import { UserBalance } from "@/@types/balance";

export const getUserBalanceAction = baseGetAction<void, UserBalance>(
  getUserBalanceService,
  "Saldo obtido com sucesso.",
  "Erro ao obter saldo."
);
