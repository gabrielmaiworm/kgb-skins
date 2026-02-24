"use server";

import { cookies } from "next/headers";

export default async function deleteAuthCookies() {
  const cookiesStore = await cookies();
  cookiesStore.delete("kgb-admin-access-token");
  cookiesStore.delete("kgb-admin-refresh-token");
}
