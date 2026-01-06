import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  seo: {
    title: "Lotus Cosmetic Panel",
    description: "Welcome to Lotus Cosmetic Panel",
  },
  common: {
    welcome: "Welcome",
    home: "Home",
    about: "About",
    contact: "Contact",
  },
} satisfies iDictionaryBaseStructure;

const fa = {
  seo: {
    title: "لوتوس کازمتیک پنل",
    description: "به لوتوس کازمتیک پنل خوش آمدید",
  },
  common: {
    welcome: "خوش آمدید",
    home: "خانه",
    about: "درباره ما",
    contact: "تماس با ما",
  },
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator({ en, fa });
