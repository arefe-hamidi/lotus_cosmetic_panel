export interface iShortDescription {
  value: string;
  description: string;
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
}
