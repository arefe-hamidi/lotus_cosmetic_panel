/** Product item from GET /api/brands/{id}/products/ */
export interface iBrandProductListItem {
  id: number
  name: string
  short_description?: string
  category: number
  category_name?: string
  brand: number
  brand_name?: string
  price: string
  main_image?: string
  image_url?: string
  is_active: boolean
  stock_quantity: number
  is_in_stock?: boolean
  created?: string
}

/** API response for GET /api/brands/{id}/products/ */
export interface iBrandProductsApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: iBrandProductListItem[]
}
