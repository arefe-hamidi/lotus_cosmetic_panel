export interface iShortDescription {
  value: string;
  description: string;
}

export interface iProductImage {
  path: string;
  description: string;
  alt_text: string;
  is_main: boolean;
  order: number;
}

export interface iProduct {
  id?: number;
  name: string;
  description: string;
  short_description: iShortDescription[];
  category: number;
  brand?: number;
  /** API may return string (e.g. "30000.00") or number */
  price: number | string;
  stock_quantity: number;
  is_active: boolean;
  images?: iProductImage[];
  created?: string;
  updated?: string;
}

/** Image item as returned by GET /api/products/:id/ (uses image or url for URL) */
export interface iProductImageApi {
  id?: number;
  image?: string;
  url?: string;
  path?: string;
  description?: string;
  alt_text?: string;
  is_main?: boolean;
  order?: number;
}

export interface iPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Product as returned from list API: { status, data: { count, next, previous, results } } */
export interface iProductListItem {
  id: number;
  name: string;
  short_description: iShortDescription[];
  category: number;
  category_name: string;
  created: string;
  image_url?: string;
  is_active: boolean;
  is_in_stock: boolean;
  main_image?: string;
  price: string;
  stock_quantity: number;
}

export interface iProductListApiResponse {
  status: string;
  data: iPaginatedResponse<iProductListItem>;
}

export interface iProductRequest {
  name: string;
  description: string;
  short_description: iShortDescription[];
  category: number;
  brand: number;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  images: iProductImage[];
}

/** Form state allows empty string for number inputs so user can clear the field */
export type iProductFormState = Omit<
  iProductRequest,
  "price" | "stock_quantity"
> & {
  price: number | "";
  stock_quantity: number | "";
  images: (Omit<iProductImage, "order"> & { order: number | "" })[];
};
