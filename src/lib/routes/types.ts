export interface iSearchParams {
  [key: string]: string | number | boolean | undefined;
}

export interface iParams extends iSearchParams {
  pageSize?: number;
  page?: number;
  search?: string;
}
