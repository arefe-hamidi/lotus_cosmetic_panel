import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary"
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types"

const en = {
  title: "Brands",
  description: "Manage your brands",
  addBrand: "Add Brand",
  form: {
    name: "Name",
    namePlaceholder: "Brand name",
    logo: "Logo",
    logoPlaceholder: "Logo URL",
    uploadImage: "Upload",
    removeImage: "Remove",
    isActive: "Is Active",
    submit: "Save",
    cancel: "Cancel",
  },
  table: {
    logo: "Logo",
    name: "Name",
    status: "Status",
    actions: "Actions",
  },
  messages: {
    success: "Brand saved successfully",
    error: "An error occurred while saving the brand",
    noBrands: "No brands found",
  },
} satisfies iDictionaryBaseStructure

const fa = {
  title: "برندها",
  description: "مدیریت برندها",
  addBrand: "افزودن برند",
  form: {
    name: "نام",
    namePlaceholder: "نام برند",
    logo: "لوگو",
    logoPlaceholder: "آدرس لوگو",
    uploadImage: "بارگذاری",
    removeImage: "حذف",
    isActive: "فعال",
    submit: "ذخیره",
    cancel: "انصراف",
  },
  table: {
    logo: "لوگو",
    name: "نام",
    status: "وضعیت",
    actions: "عملیات",
  },
  messages: {
    success: "برند با موفقیت ذخیره شد",
    error: "خطایی در ذخیره برند رخ داد",
    noBrands: "برندی یافت نشد",
  },
} satisfies typeof en

export type iDictionary = typeof en
export const getDictionary = getDictionaryGenerator({ en, fa })
