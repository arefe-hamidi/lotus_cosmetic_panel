"use server"

import { JWT } from "next-auth/jwt"
import { iRefreshTokenResponse } from "../types"
import { decodeJwtToken } from "./decodeJwtToken"
import { getIpFromHeaders } from "./getIpFromHeaders"
import { injectInternalUserDetailsToToken } from "./injectInternalUserDetailsToToken"

/**
 * Check if the JWT token needs to be refreshed
 * and update the JWT token with the new id_token,
 * refresh_token, and expires_at and user details
 */
interface TokenUser {
    ipAddress?: string;
    [key: string]: unknown;
}

export async function checkAndRefreshToken(token: JWT) {
    const user = token.user as TokenUser | undefined
    if (!user) return token
    const currentIp = await getIpFromHeaders()
    const prevIp = user.ipAddress
    if (currentIp && currentIp !== prevIp) user.ipAddress = currentIp

    const exp = token.expires_at as number | undefined
    if (!exp) return token

    const currentTime = Math.floor(Date.now() / 1000)
    const expiryTime = exp - 300
    const needsRefresh = expiryTime <= currentTime
    if (!needsRefresh) return token

    if (typeof token.refresh_token !== "string")
        throw new Error("auth.ts: JWT callback received token without refresh_token")

    try {
        const { id_token, refresh_token, expires_at } = await tokensRefresh(token.refresh_token)
        token.id_token = id_token
        token.refresh_token = refresh_token || token.refresh_token
        const decodedToken = await decodeJwtToken(id_token)
        token.expires_at = decodedToken?.exp || expires_at
        return injectInternalUserDetailsToToken(token)
    } catch (error) {
        console.error("[checkAndRefreshToken] Refresh failed:", error)
        // Don't throw: return token with error so session callback can clear user and redirect to sign-in
        token.error = "RefreshAccessTokenError"
        token.user = undefined
        return token
    }
}

/**
 * Refreshes the access token using the provided refresh token
 * returns a promise that resolves to an object containing
 * the new tokens and their expiry time.
 */
async function tokensRefresh(refreshToken: string): Promise<iRefreshTokenResponse> {
    const tokenUrl = process.env.AUTH_AZURE_AD_B2C_ISSUER?.replace("/v2.0", "/oauth2/v2.0/token")

    if (!tokenUrl) throw new Error("AUTH_AZURE_AD_B2C_ISSUER environment variable is not set")

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: process.env.AUTH_AZURE_AD_B2C_ID!,
            client_secret: process.env.AUTH_AZURE_AD_B2C_SECRET!,
            scope: "openid profile offline_access"
        })
    })

    if (!response.ok) {
        const errorData = await response.text()
        throw new Error(
            `Token refresh failed: ${response.status} ${response.statusText} - ${errorData}`
        )
    }

    const data = await response.json()

    return {
        id_token: data.id_token,
        refresh_token: data.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600)
    }
}
