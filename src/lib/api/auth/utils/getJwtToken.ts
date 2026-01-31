"use server"

import { getToken, JWT } from "next-auth/jwt"
import { cookies } from "next/headers"

/**
 * Retrieves the JWT token from the request cookies (ON SERVER SIDE)
 */
export async function getJwtToken() {
    const cookieStore = await cookies()
    const jwtToken = (await getToken({
        req: { headers: { cookie: cookieStore.toString() } } as Parameters<typeof getToken>[0]["req"],
        secret: process.env.AUTH_SECRET,
        raw: false,
        secureCookie: process.env.AUTH_SECURE_COOKIE === "true" || false
    })) as JWT | null

    if (!jwtToken?.id_token) throw new Error("Authentication required.")

    return jwtToken
}
