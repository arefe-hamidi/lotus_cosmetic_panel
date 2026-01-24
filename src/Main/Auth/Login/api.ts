import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch";
import { apiRoute } from "@/lib/routes/utils";
import type { iLoginRequest, iLoginResponse } from "./type";

export async function login(data: iLoginRequest): Promise<iLoginResponse> {
  const endpoint = apiRoute("AUTH", "/login/");
  const response = await proxyFetch(endpoint, {
    method: "POST",
    body: data,
  });

  if (!response.ok) {
    throw response;
  }

  return (await response.json()) as iLoginResponse;
}
