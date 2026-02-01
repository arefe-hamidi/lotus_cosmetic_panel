import type { iLocale } from "@/Components/Entity/Locale/types"
import type { iCategory } from "../Category/type"
import type {
  iProduct,
  iProductFormState,
  iProductImageApi,
} from "./types"

/**
 * Format price for display using locale-aware currency (IRR).
 */
export function formatPrice(locale: iLocale, price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    style: "currency",
    currency: "IRR",
    minimumFractionDigits: 0,
  }).format(num)
}

/**
 * Resolve category name by id from a flat list of categories.
 */
export function getCategoryName(
  categories: iCategory[] | undefined,
  categoryId: number
): string {
  return categories?.find((c) => c.id === categoryId)?.name ?? "-"
}

/**
 * Map API product model to form state. Handles GET-by-id shape: price as string,
 * images with image/url (URL) instead of path.
 */
export function productToFormState(product: iProduct): iProductFormState {
  const short_description =
    product.short_description?.length > 0
      ? product.short_description
      : [{ value: "", description: "" }]

  const images: iProductFormState["images"] = (product.images ?? []).map((img: iProductImageApi) => {
    const path = img.image ?? img.url ?? img.path ?? ""
    return {
      path,
      description: img.description ?? "",
      alt_text: img.alt_text ?? "",
      is_main: img.is_main ?? false,
      order: typeof img.order === "number" ? img.order : 0,
    }
  })

  const price =
    typeof product.price === "number"
      ? product.price
      : typeof product.price === "string"
        ? product.price.trim() === ""
          ? ""
          : parseFloat(product.price) || 0
        : ""

  const stock_quantity =
    typeof product.stock_quantity === "number" ? product.stock_quantity : ""

  return {
    name: product.name ?? "",
    description: product.description ?? "",
    short_description,
    category: product.category ?? 0,
    price,
    stock_quantity,
    is_active: product.is_active ?? true,
    images,
  }
}
