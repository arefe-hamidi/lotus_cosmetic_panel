import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch";
import { apiRoute } from "@/lib/routes/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { iCategory, iCategoryRequest } from "./type";

export function useGetCategories() {
  const endpoint = apiRoute("CATEGORY", "/");
  return useQuery({
    queryKey: ["categories", endpoint],
    queryFn: async () => {
      const res = await proxyFetch(endpoint);
      if (!res.ok) throw res;
      return (await res.json()) as iCategory[];
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  const endpoint = apiRoute("CATEGORY", "/menu/");
  return useMutation({
    mutationFn: async (data: iCategoryRequest) => {
      const res = await proxyFetch(endpoint, {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw res;
      return (await res.json()) as iCategory;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: iCategoryRequest }) => {
      const endpoint = apiRoute("CATEGORY", `/${id}/`);
      const res = await proxyFetch(endpoint, {
        method: "PATCH",
        body: data,
      });
      if (!res.ok) throw res;
      return (await res.json()) as iCategory;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const endpoint = apiRoute("CATEGORY", `/${id}/`);
      const res = await proxyFetch(endpoint, {
        method: "DELETE",
      });
      if (!res.ok) throw res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
