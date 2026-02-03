// Local Apps
import { DEFAULT_LOCALE } from "@/Components/Entity/Locale/constants"
import { env } from "@/lib/configs/env"
import { appRoutes } from "@/lib/routes/appRoutes"
import NextAuth from "next-auth"
import AzureADB2C from "next-auth/providers/azure-ad-b2c"
import { checkAndRefreshToken } from "./utils/checkAndRefreshToken"
import { extendJwtPayload } from "./utils/extendJwtPayload"

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: appRoutes.auth.signUp(DEFAULT_LOCALE),
        error: `/${DEFAULT_LOCALE}/auth/error`
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, account, profile, trigger, session }) {
            // Handle switching user role
            const activeUserRoleId = session?.activeUserRoleId
            if (trigger === "update" && activeUserRoleId) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const user = token.user as any
                const roles = user?.roles || []
                const isValid = roles.some((t: { id: string }) => t.id === activeUserRoleId)
                if (isValid) user.activeUserRoleId = activeUserRoleId
                return token
            }
            // Initial JWT creation
            if (account && profile) return await extendJwtPayload(account, token, profile)
            // Handle Token refresh
            return await checkAndRefreshToken(token)
        },
        async session({ session, token }) {
            if (token.error === "RefreshAccessTokenError") {
                const sessionWithError = session as typeof session & { error?: string }
                sessionWithError.error = "RefreshAccessTokenError"
                sessionWithError.user = undefined
                return sessionWithError
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            session.user = token.user as any
            return session
        }
    },
    providers: [
        AzureADB2C({
            clientId: env.AUTH_AZURE_AD_B2C_ID ?? "",
            clientSecret: env.AUTH_AZURE_AD_B2C_SECRET ?? "",
            tenantId: env.AUTH_AZURE_AD_B2C_TENANT_ID,
            authorization: {
                url: env.AUTH_AZURE_AD_B2C_AUTHORIZE,
                params: {
                    response_type: "code",
                    scope: "openid profile offline_access",
                    response_mode: "query",
                    prompt: "select_account"
                }
            }
        })
    ]
})
