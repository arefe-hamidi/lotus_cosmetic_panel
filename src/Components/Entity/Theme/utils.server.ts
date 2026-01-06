import "server-only";

import { cookies } from "next/headers";

import type { iTheme } from "./types";
import { THEME_COOKIE_NAME, THEME_VALUES } from "./constants";

export function getThemeFromCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): iTheme {
  const themeCookie = cookieStore.get(THEME_COOKIE_NAME);
  const theme = themeCookie?.value;

  if (theme && THEME_VALUES.includes(theme as iTheme)) {
    return theme as iTheme;
  }

  return "system";
}

export function getLayoutTheme(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): string {
  const theme = getThemeFromCookie(cookieStore);

  if (theme === "system") {
    return "";
  }

  return theme;
}
