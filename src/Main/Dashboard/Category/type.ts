export interface iCategory {
  id?: number;
  name: string;
  slug: string;
  parent: number | null;
  icon: string | null;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface iCategoryRequest {
  name: string;
  slug: string;
  parent: number | null;
  icon: string | null;
  order: number;
  is_active: boolean;
}
