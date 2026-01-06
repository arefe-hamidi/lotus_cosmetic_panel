import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  nav: {
    dashboard: "Dashboard",
    about: "About",
    products: "Products",
    contact: "Contact",
  },
} satisfies iDictionaryBaseStructure;

const fa = {
  nav: {
    dashboard: "داشبورد",
    about: "درباره ما",
    products: "محصولات",
    contact: "تماس با ما",
  },
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary: (locale: string) => iDictionary =
  getDictionaryGenerator({ en, fa });
