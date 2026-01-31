"use server"

import { Account, Profile } from "next-auth"
import { JWT } from "next-auth/jwt"
import { injectInternalUserDetailsToToken } from "./injectInternalUserDetailsToToken"

/**
 * On first login, add id_token, refresh_token, expires_at and
 * real user details to the JWT token associated with auth js.
 */
export async function extendJwtPayload(account: Account, token: JWT, profile: Profile) {
    if (!account.id_token)
        throw new Error("auth.ts: JWT callback received account without id_token")

    token.id_token = account.id_token
    token.refresh_token = account.refresh_token as string
    const profileWithExp = profile as { exp?: number }
    token.expires_at = profileWithExp?.exp ?? Math.floor(Date.now() / 1000) + 3600
    return injectInternalUserDetailsToToken(token)
}
