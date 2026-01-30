import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  title: "Categories",
  description: "Manage your product categories",
  addCategory: "Add Category",
  editCategory: "Edit Category",
  deleteCategory: "Delete Category",
  table: {
    name: "Name",
    slug: "Slug",
    order: "Order",
    status: "Status",
    actions: "Actions",
  },
  form: {
    name: "Name",
    slug: "Slug",
    parent: "Parent Category",
    icon: "Icon",
    order: "Order",
    isActive: "Is Active",
    submit: "Save",
    cancel: "Cancel",
  },
  messages: {
    success: "Category saved successfully",
    deleted: "Category deleted successfully",
    error: "An error occurred while saving the category",
    deleteConfirm: "Are you sure you want to delete this category?",
    noCategories: "No categories found",
  },
} satisfies iDictionaryBaseStructure;

const fa = {
  title: "دسته بندی ها",
  description: "مدیریت دسته بندی های محصولات",
  addCategory: "افزودن دسته بندی",
  editCategory: "ویرایش دسته بندی",
  deleteCategory: "حذف دسته بندی",
  table: {
    name: "نام",
    slug: "نامک",
    order: "ترتیب",
    status: "وضعیت",
    actions: "عملیات",
  },
  form: {
    name: "نام",
    slug: "نامک",
    parent: "دسته بندی مادر",
    icon: "آیکون",
    order: "ترتیب",
    isActive: "فعال",
    submit: "ذخیره",
    cancel: "انصراف",
  },
  messages: {
    success: "دسته بندی با موفقیت ذخیره شد",
    deleted: "دسته بندی با موفقیت حذف شد",
    error: "خطایی در ذخیره دسته بندی رخ داد",
    deleteConfirm: "آیا از حذف این دسته بندی مطمئن هستید؟",
    noCategories: "هیچ دسته بندی ای وجود ندارد",
  },
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator({ en, fa });
