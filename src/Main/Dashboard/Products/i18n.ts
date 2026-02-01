import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  title: "Products",
  description: "Manage your products",
  addProduct: "Add Product",
  editProduct: "Edit Product",
  deleteProduct: "Delete Product",
  table: {
    name: "Name",
    photo: "Photo",
    category: "Category",
    price: "Price",
    stockQuantity: "Stock Quantity",
    status: "Status",
    actions: "Actions",
  },
  form: {
    name: "Name",
    description: "Description",
    shortDescription: "Short Description",
    category: "Category",
    price: "Price",
    stockQuantity: "Stock Quantity",
    isActive: "Is Active",
    submit: "Save",
    cancel: "Cancel",
    addShortDescription: "Add Short Description",
    value: "Value",
    descriptionLabel: "Description",
  },
  messages: {
    success: "Product saved successfully",
    deleted: "Product deleted successfully",
    deleting: "Deleting…",
    error: "An error occurred while saving the product",
    deleteConfirm: "Are you sure you want to delete this product?",
    noProducts: "No products found",
  },
} satisfies iDictionaryBaseStructure;

const fa = {
  title: "محصولات",
  description: "مدیریت محصولات",
  addProduct: "افزودن محصول",
  editProduct: "ویرایش محصول",
  deleteProduct: "حذف محصول",
  table: {
    name: "نام",
    photo: "تصویر",
    category: "دسته بندی",
    price: "قیمت",
    stockQuantity: "موجودی",
    status: "وضعیت",
    actions: "عملیات",
  },
  form: {
    name: "نام",
    description: "توضیحات",
    shortDescription: "توضیحات کوتاه",
    category: "دسته بندی",
    price: "قیمت",
    stockQuantity: "موجودی",
    isActive: "فعال",
    submit: "ذخیره",
    cancel: "انصراف",
    addShortDescription: "افزودن توضیحات کوتاه",
    value: "مقدار",
    descriptionLabel: "توضیحات",
  },
  messages: {
    success: "محصول با موفقیت ذخیره شد",
    deleted: "محصول با موفقیت حذف شد",
    deleting: "در حال حذف…",
    error: "خطایی در ذخیره محصول رخ داد",
    deleteConfirm: "آیا از حذف این محصول مطمئن هستید؟",
    noProducts: "محصولی یافت نشد",
  },
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator({ en, fa });
