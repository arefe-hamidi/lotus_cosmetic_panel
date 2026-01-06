"use client";

import { NEXT_PUBLIC_BASE_URL } from "@/lib/configs/constants";

interface ProxyFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function proxyFetch(
  endpoint: string,
  options: ProxyFetchOptions = {}
): Promise<Response> {
  const { body, headers, ...restOptions } = options;

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  const requestBody = body ? JSON.stringify(body) : undefined;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${NEXT_PUBLIC_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
    body: requestBody,
    credentials: "include",
  });

  return response;
}
