"use client"
import { iProxyFetchOptionsWithHeader } from "../types"

/**
 * Client-side fetch function that does not include authentication or subscription key headers.
 */
export async function clientProxyFetch(endpoint: string, options: iProxyFetchOptionsWithHeader) {
    const url = "/api/proxy" + endpoint
    return fetch(url, {
        ...options,
        credentials: "include", // Ensure cookies are sent with the request
    })
}
