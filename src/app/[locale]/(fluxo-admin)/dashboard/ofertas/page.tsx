"use server";

import { Metadata } from "next";
import { AdminPageContainer } from "./_components/AdminPageContainer";

export async function metadata(): Promise<Metadata> {
  return {
    title: "Ofertas de Skins",
    description: "Gerencie ofertas de skins dos usuários",
  };
}

export default async function Page() {
  return <AdminPageContainer />;
}
