import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  logo: "Lotus Cosmetic Panel",
  logout: "Logout",
} satisfies iDictionaryBaseStructure;

const fa = {
  logo: "لوتوس کازمتیک پنل",
  logout: "خروج",
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary: (locale: string) => iDictionary =
  getDictionaryGenerator({ en, fa });
