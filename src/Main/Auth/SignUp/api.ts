import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch";
import { apiRoute } from "@/lib/routes/utils";
import type { iSignUpRequest, iSignUpResponse } from "./type";

export async function signUp(data: iSignUpRequest): Promise<iSignUpResponse> {
  const endpoint = apiRoute("AUTH", "/register/");
  const response = await proxyFetch(endpoint, {
    method: "POST",
    body: data,
  });

  if (!response.ok) {
    throw response;
  }

  return (await response.json()) as iSignUpResponse;
}
