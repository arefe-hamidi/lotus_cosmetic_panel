export interface iCategory {
  id?: number;
  name: string;
  slug: string;
  parent: number | null;
  icon: string | null;
  order: number;
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

export interface iCategoryRequest {
  name: string;
  slug: string;
  parent: number | null;
  icon: string | null;
  order: number;
  is_active: boolean;
}
