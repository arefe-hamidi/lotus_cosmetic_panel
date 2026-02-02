import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  nav: {
    dashboard: "Dashboard",
    category: "Category",
    products: "Products",
    brands: 'Brands'
  },
  userInfo: {
    notAvailable: "User info not available",
  },
} satisfies iDictionaryBaseStructure;

const fa = {
  nav: {
    dashboard: "داشبورد",
    category: "دسته بندی",
    products: "محصولات",
    brands: 'برند'
  },
  userInfo: {
    notAvailable: "اطلاعات کاربر در دسترس نیست",
  },
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary: (locale: string) => iDictionary =
  getDictionaryGenerator({ en, fa });
