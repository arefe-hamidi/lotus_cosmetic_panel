import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  title: "Create Product",
  description: "Add a new product to your catalog",
  form: {
    name: "Name",
    description: "Description",
    shortDescription: "Short Description",
    category: "Category",
    price: "Price",
    stockQuantity: "Stock Quantity",
    isActive: "Is Active",
    submit: "Create Product",
    cancel: "Cancel",
    addShortDescription: "Add Short Description",
    value: "Value",
    descriptionLabel: "Description",
  },
  messages: {
    success: "Product created successfully",
    error: "An error occurred while creating the product",
  },
} satisfies iDictionaryBaseStructure;

const fa = {
  title: "ایجاد محصول",
  description: "افزودن محصول جدید به کاتالوگ",
  form: {
    name: "نام",
    description: "توضیحات",
    shortDescription: "توضیحات کوتاه",
    category: "دسته بندی",
    price: "قیمت",
    stockQuantity: "موجودی",
    isActive: "فعال",
    submit: "ایجاد محصول",
    cancel: "انصراف",
    addShortDescription: "افزودن توضیحات کوتاه",
    value: "مقدار",
    descriptionLabel: "توضیحات",
  },
  messages: {
    success: "محصول با موفقیت ایجاد شد",
    error: "خطایی در ایجاد محصول رخ داد",
  },
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator({ en, fa });
