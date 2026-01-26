"use server";

import { cookies } from "next/headers";
import { API_BASE_URL, API_SUB_KEY } from "@/lib/configs/constants";

interface ServerProxyFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function serverProxyFetch(
  endpoint: string,
  options: ServerProxyFetchOptions = {}
): Promise<Response> {
  const { body, headers, ...restOptions } = options;

  const cookieStore = await cookies();
  const authTokenRaw = cookieStore.get("auth-token")?.value;
  
  // Decode the token (it's encoded with encodeURIComponent when set)
  const authToken = authTokenRaw ? decodeURIComponent(authTokenRaw).trim() : null;

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(API_SUB_KEY && { "ocp-apim-subscription-key": API_SUB_KEY }),
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...headers,
  };

  const requestBody = body ? JSON.stringify(body) : undefined;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
    body: requestBody,
  });

  return response;
}
