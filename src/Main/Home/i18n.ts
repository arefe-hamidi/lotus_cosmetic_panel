import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  welcome: "Welcome",
} satisfies iDictionaryBaseStructure;

const fa = {
  welcome: "خوش آمدید",
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator({ en, fa });
