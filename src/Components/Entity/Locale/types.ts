import { LOCALES } from "./constants";

export type iLocale = (typeof LOCALES)[number];

export type iTextDirection = "ltr" | "rtl";

export type iDictionary = {
  [key: string]: string | iDictionary;
};

export type iDictionaryBaseStructure = {
  [key: string]: string | iDictionaryBaseStructure;
};

export type iDictionaries<T extends iDictionary> = {
  [L in iLocale]: T;
};

export type iGetDictionary<T> = (locale: string) => T;

export type iRemovedLocale = {
  locale: string;
  purePath: string;
  isValid: boolean;
};

