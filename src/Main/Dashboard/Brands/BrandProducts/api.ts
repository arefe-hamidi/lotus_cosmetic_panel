import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch"
import { apiRoute } from "@/lib/routes/utils"
import { useQuery } from "@tanstack/react-query"
import type { iBrand } from "../types"
import type { iBrandProductsApiResponse } from "./types"

/** Single brand: GET /api/brands/{id}/ */
export function useGetBrand(brandId: number | null) {
  const endpoint =
    brandId != null ? apiRoute("BRAND", `/${brandId}/`) : ""
  return useQuery({
    queryKey: ["brands", brandId],
    queryFn: async () => {
      if (brandId == null) return null
      const res = await proxyFetch(endpoint)
      if (res.status === 404) return null
      if (!res.ok) throw res
      const body = (await res.json()) as { data?: iBrand } | iBrand
      return (body && "data" in body ? body.data : body) as iBrand
    },
    enabled: brandId != null && brandId > 0,
  })
}

/** Paginated products for a brand: GET /api/brands/{id}/products/ */
export function useGetBrandProducts(
  brandId: number | null,
  page: number = 1,
  pageSize: number = 10
) {
  const params =
    brandId == null
      ? undefined
      : { page: String(page), page_size: String(pageSize) }
  const endpoint =
    brandId != null
      ? apiRoute("BRAND", `/${brandId}/products/`, params)
      : ""
  return useQuery({
    queryKey: ["brands", "products", brandId, page, pageSize],
    queryFn: async () => {
      if (brandId == null) return { results: [], count: 0 }
      const res = await proxyFetch(endpoint)
      if (res.status === 404) return { results: [], count: 0 }
      if (!res.ok) throw res
      const body = (await res.json()) as
        | iBrandProductsApiResponse
        | { status?: string; data?: iBrandProductsApiResponse }
      const data = body && "data" in body && body.data ? body.data : body
      const results = (data as iBrandProductsApiResponse).results ?? []
      const count = (data as iBrandProductsApiResponse).count ?? results.length
      return { results, count }
    },
    enabled: brandId != null && brandId > 0,
    placeholderData: (prev) => prev,
  })
}
