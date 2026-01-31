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
    images: "Images",
    addImage: "Add Image",
    noImages: "No images added yet.",
    image: "Image",
    imagePath: "Image",
    uploadImage: "Upload",
    removeImage: "Remove",
    imageDescription: "Description",
    imageDescriptionPlaceholder: "Image description",
    altText: "Alt text",
    altTextPlaceholder: "Alt text for accessibility",
    isMainImage: "Main image",
    order: "Order",
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
    images: "تصاویر",
    addImage: "افزودن تصویر",
    noImages: "هنوز تصویری اضافه نشده است.",
    image: "تصویر",
    imagePath: "تصویر",
    uploadImage: "بارگذاری",
    removeImage: "حذف",
    imageDescription: "توضیحات تصویر",
    imageDescriptionPlaceholder: "توضیحات تصویر",
    altText: "متن جایگزین",
    altTextPlaceholder: "متن جایگزین برای دسترسی‌پذیری",
    isMainImage: "تصویر اصلی",
    order: "ترتیب",
  },
  messages: {
    success: "محصول با موفقیت ایجاد شد",
    error: "خطایی در ایجاد محصول رخ داد",
  },
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator({ en, fa });
