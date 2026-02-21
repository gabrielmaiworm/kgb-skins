const DEFAULT_LOCALE = "pt";

function getLocaleFromPath(): string {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const segment = window.location.pathname.split("/")[1];
  return segment || DEFAULT_LOCALE;
}

const AUTH_SEARCH_PARAMS = ["referrerInviteCode", "callbackUrl", "phone"] as const;

/**
 * Constrói URL de redirecionamento no fluxo auth preservando searchParams
 */
export function buildAuthRedirectUrl(
  path: string,
  params?: Record<string, string | undefined>,
  preserveFrom?: URLSearchParams
): string {
  if (typeof window === "undefined") return path;
  const locale = getLocaleFromPath();
  const basePath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`/${locale}${basePath}`, window.location.origin);

  if (preserveFrom) {
    AUTH_SEARCH_PARAMS.forEach((key) => {
      const value = preserveFrom.get(key);
      if (value) url.searchParams.set(key, value);
    });
  }
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.pathname + url.search;
}

/**
 * Adiciona searchParams de auth a uma URL de destino (ex: callbackUrl)
 */
export function appendAuthSearchParams(destinationUrl: string, preserveFrom: URLSearchParams): string {
  if (typeof window === "undefined") return destinationUrl;
  try {
    const url = new URL(destinationUrl, window.location.origin);
    AUTH_SEARCH_PARAMS.forEach((key) => {
      const value = preserveFrom.get(key);
      if (value) url.searchParams.set(key, value);
    });
    return url.pathname + url.search;
  } catch {
    return destinationUrl;
  }
}

/**
 * Retorna a URL completa de cadastro com o código do indicador (abre drawer na página de login)
 */
export function getInviteRegistrationUrl(inviteCode: string, locale?: string): string {
  if (typeof window === "undefined") return "";
  const baseLocale = locale ?? getLocaleFromPath();
  const url = new URL(`/${baseLocale}/login`, window.location.origin);
  url.searchParams.set("openRegister", "1");
  url.searchParams.set("referrerInviteCode", inviteCode);
  return url.toString();
}

/**
 * Retorna a URL de login com o código do indicador (para "Já tenho conta")
 */
export function getInviteLoginUrl(referrerInviteCode: string, locale?: string): string {
  if (typeof window === "undefined") return "";
  const baseLocale = locale ?? getLocaleFromPath();
  const url = new URL(`/${baseLocale}/login`, window.location.origin);
  url.searchParams.set("referrerInviteCode", referrerInviteCode);
  return url.toString();
}
