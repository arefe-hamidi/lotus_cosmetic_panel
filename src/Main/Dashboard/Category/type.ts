export interface iCategory {
  id?: number;
  name: string;
  parent: number | null;
  parent_name?: string | null;
  icon: string | null;
  order: number;
  is_active: boolean;
  created?: string;
  updated?: string;
}

/** API wrapper for category list: { status, data } */
export interface iCategoryListApiResponse<T> {
  status: string;
  data: iPaginatedResponse<T>;
}

export interface iPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface iCategoryRequest {
  name: string;
  parent: number | null;
  icon: string | null;
  order: number;
  is_active: boolean;
}
