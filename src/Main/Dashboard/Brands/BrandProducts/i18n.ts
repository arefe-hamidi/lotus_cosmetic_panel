import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary"
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types"

const en = {
  brandProducts: {
    title: "Products of this brand",
    description: "Products belonging to this brand",
    empty: "No products for this brand",
    close: "Close",
    brandNotFound: "Brand not found.",
    backToBrands: "Back to brands",
    loading: "Loading…",
    productTable: {
      photo: "Photo",
      name: "Name",
      category: "Category",
      price: "Price",
      stock: "Stock",
      status: "Status",
      actions: "Actions",
    },
  },
  table: {
    statusActive: "Active",
    statusInactive: "Inactive",
  },
  editBrand: "Edit brand",
} satisfies iDictionaryBaseStructure

const fa = {
  brandProducts: {
    title: "محصولات این برند",
    description: "محصولات متعلق به این برند",
    empty: "محصولی برای این برند یافت نشد",
    close: "بستن",
    brandNotFound: "برند یافت نشد.",
    backToBrands: "بازگشت به برندها",
    loading: "در حال بارگذاری…",
    productTable: {
      photo: "تصویر",
      name: "نام",
      category: "دسته‌بندی",
      price: "قیمت",
      stock: "موجودی",
      status: "وضعیت",
      actions: "عملیات",
    },
  },
  table: {
    statusActive: "فعال",
    statusInactive: "غیرفعال",
  },
  editBrand: "ویرایش برند",
} satisfies typeof en

export type iDictionary = typeof en
export const getDictionary = getDictionaryGenerator({ en, fa })
