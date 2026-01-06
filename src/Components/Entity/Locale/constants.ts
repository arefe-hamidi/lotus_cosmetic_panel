import type { iLocale, iTextDirection } from "./types";

export const LOCALES = ["en", "fa"] as const;

export const DEFAULT_LOCALE: iLocale = "en";

export const LOCALE_COOKIE_NAME = "user-locale";

export const LOCALE_FULLNAME: Record<iLocale, string> = {
  en: "English",
  fa: "فارسی",
};

export const LOCALE_DIRECTION: Record<iLocale, iTextDirection> = {
  en: "ltr",
  fa: "rtl",
};
