"use client";

import { parseCookies } from "nookies";

export async function getAcessTokenCookieNodeApi() {
  let cookies = parseCookies();
  const { "kgb-admin-access-token": token } = cookies;
  return token;
}
