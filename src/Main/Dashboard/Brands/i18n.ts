import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary"
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types"

const en = {
  title: "Brands",
  description: "Manage your brands",
  addBrand: "Add Brand",
  editBrand: "Edit Brand",
  deleteBrand: "Delete Brand",
  searchPlaceholder: "Search brands...",
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
    deleteConfirm: "Are you sure you want to delete this brand?",
    deleted: "Brand deleted successfully",
    deleting: "Deleting…",
  },
} satisfies iDictionaryBaseStructure

const fa = {
  title: "برندها",
  description: "مدیریت برندها",
  addBrand: "افزودن برند",
  editBrand: "ویرایش برند",
  deleteBrand: "حذف برند",
  searchPlaceholder: "جستجوی برندها...",
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
    deleteConfirm: "آیا از حذف این برند اطمینان دارید؟",
    deleted: "برند با موفقیت حذف شد",
    deleting: "در حال حذف…",
  },
} satisfies typeof en

export type iDictionary = typeof en
export const getDictionary = getDictionaryGenerator({ en, fa })
