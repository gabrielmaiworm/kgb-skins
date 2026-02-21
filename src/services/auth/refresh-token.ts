import { cookies } from "next/headers";

export async function RefreshToken(): Promise<any> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("kgb-admin-refresh-token");

  if (!refreshToken?.value) {
    throw new Error("No refresh token found");
  }

  const baseUrl = process.env.BASE_URL_NODE || "https://api.kgbskins.com";
  return await fetch(`${baseUrl.replace(/\/$/, "")}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      // Cookie: `kgb-admin-refresh-token=${refreshToken.value}`,
    },
    body: JSON.stringify({
      refresh_token: refreshToken.value,
    }),
  });
}
