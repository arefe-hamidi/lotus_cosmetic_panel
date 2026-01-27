import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch";
import { apiRoute } from "@/lib/routes/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { iProduct, iProductRequest, iPaginatedResponse } from "./type";

export function useGetProducts() {
  const endpoint = apiRoute("PRODUCT", "/");
  return useQuery({
    queryKey: ["products", endpoint],
    queryFn: async () => {
      const res = await proxyFetch(endpoint);
      if (!res.ok) throw res;
      const data = (await res.json()) as iPaginatedResponse<iProduct>;
      return data.results;
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
