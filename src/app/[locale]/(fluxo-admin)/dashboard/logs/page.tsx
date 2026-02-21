"use server";

import { Metadata } from "next";
import { AdminPageContainer } from "./_components/AdminPageContainer";

export async function metadata(): Promise<Metadata> {
  return {
    title: "Gerenciamento de Logs",
    description: "Página de visualização de logs da API",
  };
}

export default async function page() {
  return <AdminPageContainer />;
}
