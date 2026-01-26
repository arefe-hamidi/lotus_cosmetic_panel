import "server-only";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import type { iLocale } from "./types";
import { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "./constants";

export function getLocaleFromCookieServer(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): iLocale | null {
  const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME);
  const value = localeCookie?.value;

  if (value && LOCALES.includes(value as iLocale)) {
    return value as iLocale;
  }

  return null;
}

export async function getLocaleFromRequest(): Promise<iLocale> {
  const cookieStore = await cookies();
  const cookieLocale = getLocaleFromCookieServer(cookieStore);

  if (cookieLocale) {
    return cookieLocale;
  }

  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");

  if (acceptLanguage) {
    const languages = acceptLanguage.split(",").map((lang) => lang.split(";")[0].trim().toLowerCase());
    
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

export function hasValidLocal(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  return firstSegment ? LOCALES.includes(firstSegment as iLocale) : false;
}

export async function addLocaleToRequest(
  pathname: string,
  request: NextRequest
): Promise<NextResponse> {
  const locale = await getLocaleFromRequest();
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

