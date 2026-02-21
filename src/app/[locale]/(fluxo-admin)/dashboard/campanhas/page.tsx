"use server";

import { Metadata } from "next";
import { AdminPageContainer } from "./_components/AdminPageContainer";

export async function metadata(): Promise<Metadata> {
  return {
    title: "Gerenciamento de Campanhas",
    description: "Página de gerenciamento de campanhas de rifas",
  };
}

export default async function page() {
  return <AdminPageContainer />;
}
