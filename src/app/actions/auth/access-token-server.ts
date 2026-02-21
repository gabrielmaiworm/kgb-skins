"use server";

import { cookies } from "next/headers";

export async function getAcessTokenServerAction() {
  const cookieStore = await cookies();
  return cookieStore.get("kgb-admin-access-token");
}
