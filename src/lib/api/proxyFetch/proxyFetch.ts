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
    
    // Handle different header types (Headers, Record, Array, or undefined)
    if (options.headers) {
        if (options.headers instanceof Headers) {
            options.headers.forEach((value, key) => {
                headers.set(key, value)
            })
        } else if (Array.isArray(options.headers)) {
            for (const [key, value] of options.headers) {
                headers.set(key, value)
            }
        } else if (typeof options.headers === "object") {
            for (const [key, value] of Object.entries(options.headers)) {
                headers.set(key, String(value))
            }
        }
    }

    // Check if body is FormData or ReadableStream (for file uploads)
    const isFormData = options.body instanceof FormData
    const isStream = options.body instanceof ReadableStream
    const isUploadData = isFormData || isStream

    // Handle body - don't modify the original options object
    let processedBody: BodyInit | undefined = options.body as BodyInit | undefined

    if (!headers.has("content-type") && !isUploadData) {
        if (options.body && typeof options.body === "object" && !isFormData && !isStream) {
            processedBody = JSON.stringify(options.body)
            headers.set("content-type", "application/json; charset=utf-8")
        }
    } else if (isFormData || headers.get("content-type")?.includes("form-data")) {
        // For multipart/form-data, let fetch handle the content-type automatically
        // This is crucial for maintaining proper boundaries
        headers.delete("content-type")
    }

    const reqOptions: iProxyFetchOptionsWithHeader = {
        method: options.method,
        signal: options.signal,
        cache: options.cache,
        credentials: options.credentials,
        mode: options.mode,
        redirect: options.redirect,
        referrer: options.referrer,
        referrerPolicy: options.referrerPolicy,
        integrity: options.integrity,
        keepalive: options.keepalive,
        body: processedBody,
        headers
    }

    return IS_SERVER
        ? serverProxyFetch(endpoint, reqOptions)
        : clientProxyFetch(endpoint, reqOptions)
}
