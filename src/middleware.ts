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
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  newUrl.search = request.nextUrl.search;

  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

