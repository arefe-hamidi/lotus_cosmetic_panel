import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch"
import { apiRoute } from "@/lib/routes/utils"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { iBrand, iBrandListApiResponse, iBrandRequest } from "./type"

export function useGetBrands() {
  const endpoint = apiRoute("BRAND", "/")
  return useQuery({
    queryKey: ["brands", endpoint],
    queryFn: async () => {
      const res = await proxyFetch(endpoint)
      if (res.status === 404) return []
      if (!res.ok) throw res
      const body = (await res.json()) as iBrandListApiResponse<iBrand> | undefined
      const data = body?.data
      if (Array.isArray(data)) return data
      return data?.results ?? []
    },
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
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brands"] })
    },
  })
}
