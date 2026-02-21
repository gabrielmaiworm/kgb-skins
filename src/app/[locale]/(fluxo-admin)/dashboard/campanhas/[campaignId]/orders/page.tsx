"use server";

import { Metadata } from "next";
import { AdminPageContainer } from "./_components/AdminPageContainer";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Gerenciamento de Pedidos",
    description: "Página de gerenciamento de pedidos da campanha",
  };
}

export default async function page() {
  return <AdminPageContainer />;
}
