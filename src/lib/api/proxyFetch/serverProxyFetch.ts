"use server";

import { cookies } from "next/headers";
import { API_BASE_URL, API_SUB_KEY } from "@/lib/configs/constants";

interface ServerProxyFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

function isAuthEndpoint(endpoint: string): boolean {
  const authPaths = ["/api/auth/login", "/api/auth/sign-up", "/api/auth/signup", "/api/auth/register"]
  return authPaths.some(path => endpoint.startsWith(path))
}

export async function serverProxyFetch(
  endpoint: string,
  options: ServerProxyFetchOptions = {}
): Promise<Response> {
  const { body, headers, ...restOptions } = options;

  // Convert headers to a workable format
  const headersMap = new Map<string, string>()
  let isAuthFromHeader = false
  let contentType = "application/json"
  
  if (headers) {
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase()
        if (lowerKey === "x-is-auth-endpoint" && value === "true") {
          isAuthFromHeader = true
        } else if (lowerKey === "content-type") {
          contentType = value
        } else {
          headersMap.set(key, value)
        }
      })
    } else if (Array.isArray(headers)) {
      for (const [key, value] of headers) {
        const lowerKey = key.toLowerCase()
        if (lowerKey === "x-is-auth-endpoint" && value === "true") {
          isAuthFromHeader = true
        } else if (lowerKey === "content-type") {
          contentType = value
        } else {
          headersMap.set(key, value)
        }
      }
    } else {
      // Record<string, string>
      for (const [key, value] of Object.entries(headers)) {
        const lowerKey = key.toLowerCase()
        if (lowerKey === "x-is-auth-endpoint" && value === "true") {
          isAuthFromHeader = true
        } else if (lowerKey === "content-type") {
          contentType = value
        } else {
          headersMap.set(key, value)
        }
      }
    }
  }

  // Check if this is an auth endpoint
  const isAuth = isAuthFromHeader || isAuthEndpoint(endpoint)

  const cookieStore = await cookies();
  const authTokenRaw = cookieStore.get("auth-token")?.value;
  
  // Decode the token (it's encoded with encodeURIComponent when set)
  const authToken = authTokenRaw ? decodeURIComponent(authTokenRaw).trim() : null;
  
  const isFormData = body instanceof FormData
  const isStream = body instanceof ReadableStream

  // Build request headers
  const requestHeaders = new Headers()
  
  // Add content type if not FormData or Stream
  if (!isFormData && !isStream && contentType) {
    requestHeaders.set("Content-Type", contentType)
  }
  
  // Add subscription key if available
  if (API_SUB_KEY) {
    requestHeaders.set("ocp-apim-subscription-key", API_SUB_KEY)
  }
  
  // Add auth token only if not an auth endpoint
  if (authToken && !isAuth) {
    requestHeaders.set("Authorization", `Bearer ${authToken}`)
  }
  
  // Add other headers
  headersMap.forEach((value, key) => {
    requestHeaders.set(key, value)
  })

  // Handle body - don't stringify FormData or ReadableStream
  let requestBody: BodyInit | undefined
  if (isFormData || isStream) {
    requestBody = body as BodyInit
  } else if (body) {
    requestBody = typeof body === "string" ? body : JSON.stringify(body)
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
      body: requestBody,
    });

    if (!response.ok && response.status >= 400) {
      const errorText = await response.clone().text().catch(() => "Unknown error")
      console.error(`Backend API error (${response.status}):`, errorText.substring(0, 300))
    }

    return response;
  } catch (error) {
    console.error("ServerProxyFetch fetch error:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack)
    }
    throw error
  }
}
