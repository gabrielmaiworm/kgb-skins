"use server";

import { listLogsService } from "@/services/logs";
import { baseGetAction } from "../base-get-actions";
import { ListLogsRequest, ListLogsResponse } from "@/@types/logs";

export const listLogsAction = baseGetAction<ListLogsRequest, ListLogsResponse>(
  listLogsService,
  "Lista de logs obtida com sucesso.",
  "Erro ao obter lista de logs."
);
