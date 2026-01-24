import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { LOCALES, DEFAULT_LOCALE } from "@/Components/Entity/Locale/constants";
import type { iLocale } from "@/Components/Entity/Locale/types";

function getLocale(request: NextRequest): iLocale {
  const cookieLocale = request.cookies.get("user-locale")?.value;

  if (cookieLocale && LOCALES.includes(cookieLocale as iLocale)) {
    return cookieLocale as iLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().toLowerCase());

    for (const lang of languages) {
      if (LOCALES.includes(lang as iLocale)) {
        return lang as iLocale;
      }

      const langPrefix = lang.split("-")[0];
      if (LOCALES.includes(langPrefix as iLocale)) {
        return langPrefix as iLocale;
      }
    }
  }

  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("auth-token")?.value;

  const segments = pathname.split("/").filter(Boolean);
  const pathnameHasLocale = segments.length > 0 && LOCALES.includes(segments[0] as iLocale);

  // 1. Missing Locale Detection
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    let targetPath = pathname === "/" ? "/dashboard" : pathname;
    
    // Redirect logic for missing locale
    if (!token && (pathname === "/" || pathname.startsWith("/dashboard"))) {
      targetPath = "/auth/login";
    }

    const redirectUrl = new URL(`/${locale}${targetPath}`, request.url);
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
  }

  const currentLocale = segments[0] as iLocale;
  const pathWithoutLocale = "/" + segments.slice(1).join("/");

  // 2. Auth Logic for localized paths
  const isAuthPage = pathWithoutLocale.startsWith("/auth");
  const isDashboardPage = pathWithoutLocale.startsWith("/dashboard") || pathWithoutLocale === "/";

  // Redirect to login if NO TOKEN and trying to access protected routes
  if (!token && isDashboardPage) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/auth/login`, request.url)
    );
  }

  // Redirect to dashboard if HAS TOKEN and trying to access auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/dashboard`, request.url)
    );
  }

  // Redirect to dashboard if HAS TOKEN and at root locale path (e.g. /en/)
  if (token && pathWithoutLocale === "/") {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/dashboard`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

