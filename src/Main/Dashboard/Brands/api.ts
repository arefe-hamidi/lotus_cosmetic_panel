import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch"
import { apiRoute } from "@/lib/routes/utils"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { iBrand, iBrandListApiResponse, iBrandRequest } from "./types"

/**
 * Same API GET /api/brands/.
 * - useGetBrands() → no params, returns array (for dropdowns).
 * - useGetBrands(page, pageSize, search) → with params, returns { results, count } (for list page).
 */
export function useGetBrands(
  page?: number,
  pageSize?: number,
  search?: string
) {
  const isPaginated = page != null && page >= 1
  const params: Record<string, string> = {}
  if (isPaginated) {
    params.page = String(page)
    params.page_size = String(pageSize ?? 10)
    if (search?.trim()) params.search = search.trim()
  }
  const endpoint = apiRoute("BRAND", "/", Object.keys(params).length ? params : undefined)
  return useQuery({
    queryKey: ["brands", endpoint, isPaginated ? page : null, isPaginated ? pageSize : null, isPaginated ? search : null],
    queryFn: async () => {
      const res = await proxyFetch(endpoint)
      if (res.status === 404) {
        return isPaginated ? { results: [], count: 0 } : []
      }
      if (!res.ok) throw res
      const body = (await res.json()) as iBrandListApiResponse<iBrand> | undefined
      const data = body?.data
      const results = Array.isArray(data) ? data : (data?.results ?? [])
      const count = Array.isArray(data) ? data.length : (data?.count ?? results.length)
      if (isPaginated) return { results, count }
      return results
    },
    placeholderData: (prev) => prev,
  })
}

export function useCreateBrand() {
  const qc = useQueryClient()
  const endpoint = apiRoute("BRAND", "/")
  return useMutation({
    mutationFn: async (data: FormData | iBrandRequest) => {
      const res = await proxyFetch(endpoint, {
        method: "POST",
        body: data,
      })
      if (!res.ok) throw res
      return (await res.json()) as iBrand
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brands"] })
    },
  })
}

export function useUpdateBrand() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData | iBrandRequest }) => {
      const endpoint = apiRoute("BRAND", `/${id}/`)
      const res = await proxyFetch(endpoint, {
        method: "PATCH",
        body: data,
      })
      if (!res.ok) throw res
      return (await res.json()) as iBrand
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brands"] })
    },
  })
}

export function useDeleteBrand() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const endpoint = apiRoute("BRAND", `/${id}/`)
      const res = await proxyFetch(endpoint, { method: "DELETE" })
      if (!res.ok) throw res
      // Consume body when present (e.g. 200 with body); 204 No Content has nothing to read
      if (res.status !== 204) {
        try {
          await res.text()
        } catch {
          // ignore
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brands"] })
    },
  })
}
