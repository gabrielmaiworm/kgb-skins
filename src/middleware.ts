import { NextResponse, NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";

const locales = ["pt"];

const defaultLocale = "pt";

const nextIntlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/api/auth") ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|json|css|js|map)$/)
  ) {
    return NextResponse.next();
  }

  const authSessionExpired = req.cookies.get("auth-session-expired");
  if (authSessionExpired?.value) {
    const locale = locales.includes(pathname.split("/")[1] as any) ? pathname.split("/")[1] : defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, req.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set("auth-session-expired", "", { maxAge: 0, path: "/" });
    return res;
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Bloquear acesso ao dashboard para usuários não admin
  const isDashboardRoute = locales.some((locale) => pathname.startsWith(`/${locale}/dashboard`));
  const isProtectedClientRoute = locales.some(
    (locale) => pathname.startsWith(`/${locale}/perfil`) || pathname.startsWith(`/${locale}/meus-numeros`)
  );

  if (isProtectedClientRoute && !token) {
    const loginUrl = new URL(`/${defaultLocale}/login`, req.url);
    const callbackUrl = pathname;
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (isDashboardRoute) {
    // Se não estiver autenticado, redireciona para login
    if (!token) {
      const loginUrl = new URL(`/${defaultLocale}/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Se estiver autenticado mas não for admin, redireciona para unauthorized
    const userRole = token.role as string;
    if (userRole !== "admin") {
      const unauthorizedUrl = new URL(`/${defaultLocale}/unauthorized`, req.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  const isLocaleMissing = !locales.some((locale) => pathname.startsWith(`/${locale}`));
  if (isLocaleMissing) {
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return nextIntlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|static).*)"],
};
