import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch";
import { apiRoute } from "@/lib/routes/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  iProduct,
  iProductRequest,
  iProductListItem,
  iProductListApiResponse,
} from "./types";

/** Response shape for GET /api/products/:id/ - backend may wrap in { status, data } or return product directly */
export interface iProductDetailApiResponse {
  status?: string
  data?: iProduct | { product?: iProduct }
  product?: iProduct
}

function isProductLike(obj: unknown): obj is iProduct {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    "category" in obj
  )
}

export function useGetProduct(id: number | null) {
  const endpoint = id != null ? apiRoute("PRODUCT", `/${id}/`) : null
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!endpoint) return null
      const res = await proxyFetch(endpoint)
      if (!res.ok) throw res
      const body = (await res.json()) as iProductDetailApiResponse & iProduct
      if (body?.status === "success" && body?.data) {
        const data = body.data
        if (isProductLike(data)) return data as iProduct
        if (typeof data === "object" && data !== null && "product" in data && isProductLike((data as { product?: iProduct }).product)) {
          return (data as { product: iProduct }).product
        }
      }
      if (typeof body?.data === "object" && body.data !== null && isProductLike(body.data)) return body.data as iProduct
      if (isProductLike(body)) return body as iProduct
      return null
    },
    enabled: id != null && id > 0,
  })
}

export function useGetProducts(page: number = 1, pageSize: number = 10) {
  const endpoint = apiRoute("PRODUCT", "/", {
    page: String(page),
    page_size: String(pageSize),
  });
  return useQuery({
    queryKey: ["products", endpoint, page, pageSize],
    queryFn: async () => {
      const res = await proxyFetch(endpoint);
      if (!res.ok) throw res;
      const body = (await res.json()) as iProductListApiResponse;
      if (body?.status === "success" && body?.data) {
        return {
          results: body.data.results as iProductListItem[],
          count: body.data.count,
        };
      }
      return { results: [], count: 0 };
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  const endpoint = apiRoute("PRODUCT", "/");
  return useMutation({
    mutationFn: async (data: iProductRequest) => {
      const res = await proxyFetch(endpoint, {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw res;
      return (await res.json()) as iProduct;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: iProductRequest }) => {
      const endpoint = apiRoute("PRODUCT", `/${id}/`);
      const res = await proxyFetch(endpoint, {
        method: "PATCH",
        body: data,
      });
      if (!res.ok) throw res;
      return (await res.json()) as iProduct;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

/** DELETE {{base_url}}/api/products/{{product_id}}/ */
export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const endpoint = apiRoute("PRODUCT", `/${id}/`);
      const res = await proxyFetch(endpoint, {
        method: "DELETE",
      });
      if (!res.ok) throw res;
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.removeQueries({ queryKey: ["product", id] });
    },
  });
}
