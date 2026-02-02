// Local Apps
import { refreshTokensServer } from "@/lib/api/auth/refreshToken"
import { serverProxyFetch } from "@/lib/api/proxyFetch/serverProxyFetch"
import { API_BASE_URL } from "@/lib/configs/constants"
import { NextRequest, NextResponse } from "next/server"

const AUTH_TOKEN_COOKIE = "auth-token"
const AUTH_REFRESH_COOKIE = "auth-refresh-token"
const COOKIE_MAX_AGE_30_DAYS = 30 * 24 * 60 * 60

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
    
    // For non-auth endpoints, we'll let the backend handle authentication
    // We just need to pass the token if it exists
    // The backend will return 401 if the token is invalid/missing
    if (!isAuth) {
        // Log all cookies for debugging
        const allCookies = req.cookies.getAll()
        console.log(`[ProxyHandler] All cookies in request:`, allCookies.map(c => c.name))
    }

    const contentType = headers.get("content-type")
    const requestHeaders: Record<string, string> = {}
    
    // Add a flag to indicate if this is an auth endpoint (for serverProxyFetch)
    if (isAuth) {
        requestHeaders["x-is-auth-endpoint"] = "true"
    }
    
    // Read auth token from request cookies and pass it to serverProxyFetch
    let authToken: string | null = null
    if (!isAuth) {
        try {
            const authTokenRaw = req.cookies.get("auth-token")?.value
            console.log(`[ProxyHandler] Reading auth-token cookie. Found:`, !!authTokenRaw, `Raw length:`, authTokenRaw?.length || 0)
            if (authTokenRaw) {
                authToken = decodeURIComponent(authTokenRaw).trim()
                console.log(`[ProxyHandler] Decoded token length:`, authToken.length)
                if (authToken && authToken.length > 0) {
                    // Pass the token via header so serverProxyFetch can use it
                    requestHeaders["x-auth-token"] = authToken
                    console.log(`[ProxyHandler] ✅ Passing auth token to backend for ${endpoint} (token length: ${authToken.length})`)
                } else {
                    console.log(`[ProxyHandler] ❌ Token is empty after decode`)
                }
            } else {
                console.log(`[ProxyHandler] ⚠️ No auth-token cookie found - request will proceed without token`)
            }
        } catch (error) {
            console.error("[ProxyHandler] Error reading auth token:", error)
        }
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

        let proxyRes = await serverProxyFetch(endpoint, {
            method,
            headers: requestHeaders,
            body: requestBody
        })

        // On 401, try to refresh token and retry once
        if (proxyRes.status === 401 && !isAuth) {
            const refreshRaw = req.cookies.get(AUTH_REFRESH_COOKIE)?.value
            if (refreshRaw) {
                try {
                    const refreshToken = decodeURIComponent(refreshRaw).trim()
                    if (refreshToken) {
                        const { access, refresh } = await refreshTokensServer(refreshToken)
                        const newHeaders = { ...requestHeaders, "x-auth-token": access }
                        proxyRes = await serverProxyFetch(endpoint, {
                            method,
                            headers: newHeaders,
                            body: requestBody
                        })
                        const responseHeaders = cleanupHeaders(proxyRes.headers)
                        const res = new NextResponse(await proxyRes.text(), {
                            status: proxyRes.status,
                            statusText: proxyRes.statusText,
                            headers: responseHeaders
                        })
                        res.headers.append(
                            "Set-Cookie",
                            `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(access)}; Path=/; Max-Age=${COOKIE_MAX_AGE_30_DAYS}; SameSite=Lax`
                        )
                        if (refresh) {
                            res.headers.append(
                                "Set-Cookie",
                                `${AUTH_REFRESH_COOKIE}=${encodeURIComponent(refresh)}; Path=/; Max-Age=${COOKIE_MAX_AGE_30_DAYS}; SameSite=Lax`
                            )
                        }
                        return res
                    }
                } catch (refreshError) {
                    console.error("[ProxyHandler] Token refresh failed:", refreshError)
                }
            }
        }

        console.log(`[ProxyHandler] Backend response status: ${proxyRes.status}`)

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
