import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch";
import { apiRoute } from "@/lib/routes/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { iProduct, iProductRequest } from "../type";

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
