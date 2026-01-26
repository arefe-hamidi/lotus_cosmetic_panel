import { IS_SERVER } from "../../configs/constants"
import { iProxyFetchOptions, iProxyFetchOptionsWithHeader } from "../types"
import { clientProxyFetch } from "./clientProxyFetch"
import { serverProxyFetch } from "./serverProxyFetch"

export async function proxyFetch(endpoint: string, options: iProxyFetchOptions = {}) {
    if (!endpoint.startsWith("/")) {
        console.warn(`proxyFetch: Endpoint should start with a slash. endpoint: ${endpoint}`)
        endpoint = `/${endpoint}`
    }

    const headers = new Headers()
    if (typeof options.headers === "object" && options.headers !== null)
        for (const [key, value] of Object.entries(options.headers)) {
            headers.set(key.toLowerCase(), value as string)
        }

    // Check if body is FormData or ReadableStream (for file uploads)
    const isFormData = options.body instanceof FormData
    const isStream = options.body instanceof ReadableStream
    const isUploadData = isFormData || isStream

    if (!headers.has("content-type") && !isUploadData) {
        if (options.body && typeof options.body === "object") {
            options.body = JSON.stringify(options.body)
            headers.set("content-type", "application/json; charset=utf-8")
        }
    } else if (isFormData || headers.get("content-type")?.includes("form-data")) {
        // For multipart/form-data, let fetch handle the content-type automatically
        // This is crucial for maintaining proper boundaries
        headers.delete("content-type")
    }

    const reqOptions = {
        ...options,
        headers
    } as iProxyFetchOptionsWithHeader

    return IS_SERVER
        ? serverProxyFetch(endpoint, reqOptions)
        : clientProxyFetch(endpoint, reqOptions)
}
