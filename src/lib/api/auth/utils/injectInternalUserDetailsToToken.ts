"use server"

import { JWT } from "next-auth/jwt"
import { proxyFetch } from "../../proxyFetch/proxyFetch"
import { apiRoute } from "../../../routes/utils"
import { iResponses, iUserAccount } from "../types"
import { getIpFromHeaders } from "./getIpFromHeaders"

/**
 * Get real user details from internal API and inject them into the JWT token
 */
export async function injectInternalUserDetailsToToken(token: JWT) {
    const headers = { authorization: `Bearer ${token.id_token}` }
    const rolesEndpoint = apiRoute("AUTH", "/UserRoles/me")
    const userEndpoint = apiRoute("AUTH", "/UserAccounts/me")
    const [rolesResult, userResult] = await Promise.allSettled([
        proxyFetch(rolesEndpoint, { headers }),
        proxyFetch(userEndpoint, { headers })
    ])

    if (rolesResult.status === "rejected")
        throw new Error(
            `auth.ts: Failed to fetch User Roles in JWT\n ${String(rolesResult.reason)}`
        )
    if (userResult.status === "rejected")
        throw new Error(
            `auth.ts: Failed to fetch User Accounts in JWT\n ${String(userResult.reason)}`
        )

    const rolesRes = rolesResult.value
    const userRes = userResult.value
    if (!rolesRes.ok)
        throw new Error(
            `auth.ts: Failed to fetch User Roles in JWT\n ${rolesRes.status} ${rolesRes.statusText}`
        )
    if (!userRes.ok)
        throw new Error(
            `auth.ts: Failed to fetch User Details in JWT\n ${userRes.status} ${userRes.statusText}`
        )

    const [roles, user] = (await Promise.all([rolesRes.json(), userRes.json()])) as iResponses
    // Type assertion to ensure user is treated as iUserAccount
    const userAccount: iUserAccount = user as iUserAccount

    // Try to detect requester IP from incoming headers
    const ip = await getIpFromHeaders()
    if (ip) userAccount.ipAddress = ip

    userAccount.activeUserRoleId = null
    userAccount.roles = roles.items

    // In the refresh-token process, we select the same User Role that the user previously selected and continue.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tokenUser = (token.user as any) as iUserAccount | undefined
    if (tokenUser?.activeUserRoleId) userAccount.activeUserRoleId = tokenUser.activeUserRoleId
    //  If the user only has access to one role will not go to the switch page
    //  Otherwise, user must specify which role to enter into on the switch page
    else if (userAccount.roles && userAccount.roles.length === 1) userAccount.activeUserRoleId = userAccount.roles[0].id

    token.user = userAccount
    return token
}
