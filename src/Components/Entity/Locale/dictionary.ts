import type { iLocale, iDictionary, iDictionaries } from "./types";
import { LOCALES, DEFAULT_LOCALE } from "./constants";

export function getDictionaryGenerator<T extends iDictionary>(
  dictionaries: iDictionaries<T>
) {
  return (locale: string): T => {
    const validLocale = LOCALES.includes(locale as iLocale)
      ? (locale as iLocale)
      : DEFAULT_LOCALE;
    return dictionaries[validLocale] || dictionaries[DEFAULT_LOCALE];
  };
}
