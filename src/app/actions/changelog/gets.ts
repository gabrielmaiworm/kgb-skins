"use server";

import { listChangelogService } from "@/services/changelog";
import { baseGetAction } from "../base-get-actions";
import { ListChangelogRequest, ListChangelogResponse } from "@/@types/changelog";

export const listChangelogAction = baseGetAction<ListChangelogRequest, ListChangelogResponse>(
  listChangelogService,
  "Changelog obtido com sucesso.",
  "Erro ao obter changelog."
);
