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

/** API response for category list: plain array or { status, data: T[] } */
export type iCategoryListApiResponse<T> =
  | { status?: string; data: T[] }
  | T[];

export interface iCategoryRequest {
  name: string;
  parent: number | null;
  icon: string | null;
  order: number;
  is_active: boolean;
}
