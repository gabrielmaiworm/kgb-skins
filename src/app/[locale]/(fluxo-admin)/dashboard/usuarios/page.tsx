"use server";

import { Metadata } from "next";
import { AdminPageContainer } from "./_components/AdminPageContainer";

export async function metadata(): Promise<Metadata> {
  return {
    title: "Gerenciamento de Usuários",
    description: "Página de gerenciamento de usuários",
  };
}

export default async function page() {
  return <AdminPageContainer />;
}
