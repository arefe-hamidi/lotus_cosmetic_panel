"use client"
import { iProxyFetchOptionsWithHeader } from "../types"
import { NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_API_SUB_KEY } from "../../configs/constants"

/**
 * Helper function to get cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  
  const cookies = document.cookie.split(";")
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.substring(name.length + 1))
    }
  }
  return null
}

/**
 * Check if endpoint is an auth endpoint (login, signup, etc.)
 */
function isAuthEndpoint(endpoint: string): boolean {
  const authPaths = ["/api/auth/login", "/api/auth/sign-up", "/api/auth/signup", "/api/auth/register"]
  return authPaths.some(path => endpoint.startsWith(path))
}

/**
 * Client-side fetch function that calls the backend directly (no proxy).
 */
export async function clientProxyFetch(endpoint: string, options: iProxyFetchOptionsWithHeader) {
    // Build the full URL - call backend directly
    const url = endpoint.startsWith("http")
        ? endpoint
        : `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`

    // Read auth token from cookie
    const authTokenRaw = getCookie("auth-token")
    const authToken = authTokenRaw ? authTokenRaw.trim() : null

    // Check if this is an auth endpoint
    const isAuth = isAuthEndpoint(endpoint)

    // Build request headers
    const requestHeaders = new Headers(options.headers)

    // Add subscription key if available
    if (NEXT_PUBLIC_API_SUB_KEY) {
        requestHeaders.set("ocp-apim-subscription-key", NEXT_PUBLIC_API_SUB_KEY)
    }

    // Add auth token only if not an auth endpoint
    if (authToken && !isAuth) {
        requestHeaders.set("Authorization", `Bearer ${authToken}`)
    }

    return fetch(url, {
        ...options,
        headers: requestHeaders,
        credentials: "include", // Ensure cookies are sent with the request
    })
}
