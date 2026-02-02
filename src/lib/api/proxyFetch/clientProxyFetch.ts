"use client"
import { refreshTokenAction } from "@/lib/api/auth/actions"
import { iProxyFetchOptionsWithHeader } from "../types"
import { NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_API_SUB_KEY } from "../../configs/constants"

const LOGIN_REDIRECT_LOCALE_COOKIE = "user-locale"
const VALID_LOCALES = ["en", "fa"] as const
const DEFAULT_LOCALE = "en"

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
 * Get current locale from pathname or cookie (client-only). Used for 401 redirect.
 */
function getLocaleForRedirect(): string {
  if (typeof window === "undefined") return DEFAULT_LOCALE
  const pathLocale = window.location.pathname.split("/").filter(Boolean)[0]
  if (pathLocale && VALID_LOCALES.includes(pathLocale as (typeof VALID_LOCALES)[number])) return pathLocale
  const cookieLocale = getCookie(LOGIN_REDIRECT_LOCALE_COOKIE)
  if (cookieLocale && VALID_LOCALES.includes(cookieLocale as (typeof VALID_LOCALES)[number])) return cookieLocale
  return DEFAULT_LOCALE
}

/**
 * Redirect to login page (used on 401). Replaces history so back button does not return.
 */
function redirectToLogin(): void {
  if (typeof window === "undefined") return
  const locale = getLocaleForRedirect()
  window.location.replace(`/${locale}/auth/login`)
}

/**
 * Check if endpoint is an auth endpoint (login, signup, etc.)
 */
function isAuthEndpoint(endpoint: string): boolean {
  const authPaths = ["/api/auth/login", "/api/auth/sign-up", "/api/auth/signup", "/api/auth/register"]
  return authPaths.some(path => endpoint.startsWith(path))
}

export interface iClientProxyFetchOptions extends Omit<iProxyFetchOptionsWithHeader, "headers"> {
  headers?: Headers
  _isRetry?: boolean
}

/** Single refresh in flight so multiple 401s don't each trigger refresh and cause a loop */
let refreshPromise: Promise<void> | null = null

/**
 * Client-side fetch function that calls the backend directly (no proxy).
 * On 401, tries to refresh the token once and retries the request.
 * Retry does not pass headers so the new cookie (set by refresh) is read.
 */
export async function clientProxyFetch(
  endpoint: string,
  options: iClientProxyFetchOptions = {}
) {
  const { _isRetry, ...fetchOptions } = options
  const isRetry = _isRetry === true

  const url =
    endpoint.startsWith("http")
      ? endpoint
      : `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`

  const authTokenRaw = getCookie("auth-token")
  const authToken = authTokenRaw ? authTokenRaw.trim() : null
  const isAuth = isAuthEndpoint(endpoint)

  const requestHeaders = new Headers(options.headers ?? undefined)
  if (NEXT_PUBLIC_API_SUB_KEY) {
    requestHeaders.set("ocp-apim-subscription-key", NEXT_PUBLIC_API_SUB_KEY)
  }
  if (authToken && !isAuth) {
    requestHeaders.set("Authorization", `Bearer ${authToken}`)
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: requestHeaders,
    credentials: "include",
  })

  if (response.status === 401 && !isAuth) {
    if (!isRetry) {
      try {
        if (refreshPromise) {
          await refreshPromise
        } else {
          refreshPromise = refreshTokenAction().then(() => {
            refreshPromise = null
          })
          await refreshPromise
        }
        return clientProxyFetch(endpoint, {
          ...fetchOptions,
          _isRetry: true
        })
      } catch {
        refreshPromise = null
        redirectToLogin()
        throw response
      }
    }
    redirectToLogin()
    throw response
  }

  return response
}
