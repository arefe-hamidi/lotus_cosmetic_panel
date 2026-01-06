"use client";

import type {
  iLocale,
  iDictionary,
  iDictionaries,
  iRemovedLocale,
} from "./types";
import { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "./constants";

export function getLocaleFromPathname(pathname: string): iLocale {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && LOCALES.includes(firstSegment as iLocale)) {
    return firstSegment as iLocale;
  }

  return DEFAULT_LOCALE;
}

export function removeLocaleFromPathname(pathname: string): iRemovedLocale {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && LOCALES.includes(firstSegment as iLocale)) {
    return {
      locale: firstSegment,
      purePath: "/" + segments.slice(1).join("/"),
      isValid: true,
    };
  }

  return {
    locale: DEFAULT_LOCALE,
    purePath: pathname,
    isValid: false,
  };
}

export function getLocaleFromCookie(): iLocale | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split(";");
  const localeCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${LOCALE_COOKIE_NAME}=`)
  );

  if (localeCookie) {
    const value = localeCookie.split("=")[1]?.trim();
    if (value && LOCALES.includes(value as iLocale)) {
      return value as iLocale;
    }
  }

  return null;
}

export function setLocaleToCookie(locale: iLocale): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export function getLocalDate(
  date: Date,
  locale: iLocale,
  includeTime = false
): string {
  const localeCode = locale === "en" ? "en-US" : "fa-IR";
  const options: Intl.DateTimeFormatOptions = includeTime
    ? {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    : {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

  return new Intl.DateTimeFormat(localeCode, options).format(date);
}
