import { serverProxyFetch } from "@/lib/api/proxyFetch/serverProxyFetch"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/api/auth/auth"
import { API_BASE_URL } from "@/lib/configs/constants"

function isAuthEndpoint(endpoint: string): boolean {
    const authPaths = ["/api/auth/login", "/api/auth/sign-up", "/api/auth/signup", "/api/auth/register"]
    return authPaths.some(path => endpoint.startsWith(path))
}

export async function proxyHandler(req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
    const { method, headers } = req
    const url = new URL(req.url)
    
    // Extract endpoint from slug params or URL pathname
    const resolvedParams = await params
    let endpoint = ""
    
    if (resolvedParams?.slug && Array.isArray(resolvedParams.slug)) {
        endpoint = "/" + resolvedParams.slug.join("/")
    } else {
        endpoint = url.pathname.replace(/^\/api\/proxy/, "") || url.href.split("/api/proxy")[1] || ""
    }
    
    if (!endpoint.startsWith("/")) {
        endpoint = "/" + endpoint
    }
    
    if (url.search) {
        endpoint += url.search
    }
    
    // Allow auth endpoints without session check
    const isAuth = isAuthEndpoint(endpoint)
    
    if (!isAuth) {
        try {
            const session = await auth()
            if (!session) {
                return new Response("Session Unauthorized", { status: 401 })
            }
        } catch (error) {
            // Allow request to continue if auth check fails
        }
    }

    const contentType = headers.get("content-type")
    const requestHeaders: Record<string, string> = {}
    
    // Add a flag to indicate if this is an auth endpoint (for serverProxyFetch)
    if (isAuth) {
        requestHeaders["x-is-auth-endpoint"] = "true"
    }
    
    // Copy relevant headers from the incoming request
    if (contentType) {
        requestHeaders["content-type"] = contentType
    }

    let requestBody: unknown = undefined
    
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        try {
            if (contentType?.includes("multipart/form-data")) {
                requestBody = await req.formData()
            } else {
                // For JSON and other content types, read as text first
                const raw = await req.text()
                if (raw && raw.length > 0) {
                    if (contentType?.includes("application/json")) {
                        try {
                            requestBody = JSON.parse(raw)
                        } catch {
                            // If parsing fails, use raw string
                            requestBody = raw
                        }
                    } else {
                        requestBody = raw
                    }
                }
            }
        } catch (error) {
            console.error("[ProxyHandler] Error reading request body:", error)
            // Continue without body if reading fails
        }
    }
    
    try {
        console.log(`[ProxyHandler] Calling backend: ${method} ${endpoint}`)
        console.log(`[ProxyHandler] Request headers:`, requestHeaders)
        console.log(`[ProxyHandler] Request body:`, typeof requestBody === "object" ? JSON.stringify(requestBody) : requestBody)
        
        const proxyRes = await serverProxyFetch(endpoint, {
            method,
            headers: requestHeaders,
            body: requestBody
        })
        
        console.log(`[ProxyHandler] Backend response status: ${proxyRes.status}`)
        
        // Read response body safely
        let responseBody: string = ""
        try {
            responseBody = await proxyRes.text()
            console.log(`[ProxyHandler] Response body length: ${responseBody.length}`)
        } catch (bodyError) {
            console.error("[ProxyHandler] Error reading response body:", bodyError)
            responseBody = ""
        }
        
        return new NextResponse(responseBody, {
            status: proxyRes.status,
            statusText: proxyRes.statusText,
            headers: cleanupHeaders(proxyRes.headers)
        })
    } catch (error) {
        console.error("============ PROXY HANDLER ERROR ============")
        console.error("Error type:", error?.constructor?.name)
        console.error("Error:", error)
        console.error("Endpoint:", endpoint)
        console.error("Method:", method)
        if (error instanceof Error) {
            console.error("Error message:", error.message)
            console.error("Error stack:", error.stack)
        }
        if (error instanceof TypeError && error.message.includes("fetch")) {
            console.error("Network error - is the backend running at", API_BASE_URL, "?")
        }
        console.error("=============================================")
        return new NextResponse(
            JSON.stringify({ 
                error: "Proxy request failed", 
                message: error instanceof Error ? error.message : String(error),
                endpoint,
                hint: error instanceof TypeError && error.message.includes("fetch") 
                    ? "Check if backend is running" 
                    : "See server logs for details"
            }),
            { 
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        )
    }
}

/**
 *  In proxyHandler, when we use proxyFetch, there is a fetch method
 *  in it and this method makes some changes to the response body,
 *  like decompressing it. So, we cannot send the headers directly
 *  to the client because it will cause an error and we have
 *  to remove the incorrect and unused ones first.
 */
export function cleanupHeaders(headers: Headers): Headers {
    const cleanedHeaders = new Headers()
    const excludedHeaders = [
        "content-encoding",
        "transfer-encoding",
        "content-length",
        "connection"
    ]
    for (const [key, value] of headers.entries()) {
        const lowerKey = key.toLowerCase()
        if (!excludedHeaders.includes(lowerKey)) cleanedHeaders.set(key, value)
    }
    return cleanedHeaders
}
