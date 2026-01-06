import type { iLocale, iTextDirection } from "./types";
import { LOCALE_DIRECTION, DEFAULT_LOCALE } from "./constants";

export function getTextDirection(locale: string): iTextDirection {
  const validLocale = (locale as iLocale) in LOCALE_DIRECTION
    ? (locale as iLocale)
    : DEFAULT_LOCALE;
  return LOCALE_DIRECTION[validLocale];
}

