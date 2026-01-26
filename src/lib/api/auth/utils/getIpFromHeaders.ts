"use server"

import { headers as nextHeaders } from "next/headers"

/**
 * Extracts the user's IP address from the request headers.
 * Checks common proxy headers and returns the first valid IP found.
 */
export async function getIpFromHeaders(): Promise<string | null> {
    if (process.env.IS_LOCAL === "true") return "127.0.0.1"
    try {
        const hdrs = await nextHeaders()
        const xff = hdrs.get("x-forwarded-for") || hdrs.get("x-forwarded-for".toLowerCase())
        const realIp = hdrs.get("x-real-ip")
        const remoteAddr = hdrs.get("remote-addr")
        const ipCandidate = (xff?.split(",")[0]?.trim() || realIp || remoteAddr || "").trim()
        return ipCandidate ? ipCandidate.split(":")[0] : null
    } catch {
        return null
    }
}
