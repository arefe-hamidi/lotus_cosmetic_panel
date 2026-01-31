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
  price: number;
  stock_quantity: number;
  is_active: boolean;
  images?: iProductImage[];
  created?: string;
  updated?: string;
}

export interface iPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface iProductRequest {
  name: string;
  description: string;
  short_description: iShortDescription[];
  category: number;
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
