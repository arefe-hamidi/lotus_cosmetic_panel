# Auth & Session Pattern

NextAuth.js integration with Azure AD B2C, JWT session management, and role-based access control.

---

## Overview

The authentication system provides:

- **Azure AD B2C Integration**: Enterprise SSO with organizational accounts
- **JWT Session Strategy**: Stateless session management with token refresh
- **Role-based Access Control**: Multi-tenant user role switching
- **Proxy Protection**: Route-level authorization with locale support
- **Server-side Auth Injection**: Automatic auth headers in API calls

---

## Architecture Components

### 1. NextAuth.js Configuration (`lib/auth/auth.ts`)

```ts
export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" },
    providers: [
        AzureADB2C({
            /* Azure B2C config */
        })
    ],
    callbacks: {
        jwt: {
            /* Token refresh & role switching */
        },
        session: {
            /* Session serialization */
        },
        authorized: {
            /* Route protection + locale redirect */
        }
    }
})
```

### 2. Route Protection Flow

```
Request → proxy → authorized() callback
                           ↓
                  ┌─ Add locale if missing (/dashboard → /en/dashboard)
                  ├─ Check access denied (empty roles array)
                  ├─ Enforce role selection (activeUserRoleId required)
                  ├─ Protect dashboard routes (auth required)
                  └─ Redirect logged-in users from /signin → /dashboard
```

### 3. Session Structure

```ts
interface Session {
    user: {
        id: string
        email: string
        name: string
        roles: Array<{ id: string; name: string }>
        activeUserRoleId: string // Current selected role
    }
}
```

---

## Usage Patterns

### Server Components & Route Handlers

```ts
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user) redirect("/auth/signin")

    // Access user info
    const { name, activeUserRoleId } = session.user
    return <div>Welcome {name}</div>
}
```

### Client Components (Session Context)

```tsx
"use client"
import { useSession } from "next-auth/react"

export function UserProfile() {
    const { data: session, status } = useSession()

    if (status === "loading") return <div>Loading...</div>
    if (!session) return <div>Not logged in</div>

    return <div>{session.user.name}</div>
}
```

### Role Switching

```ts
import { useSession } from "next-auth/react"

export function useRoleSwitch() {
    const { update } = useSession()

    return async (newRoleId: string) => {
        await update({ activeUserRoleId: newRoleId })
        // Session will be updated, triggers re-render
    }
}
```

---

## Integration with API Layer

### Server-side Auth Injection (proxyFetch)

```ts
// Automatic in serverProxyFetch
headers.set("authorization", `Bearer ${token.id_token}`)
headers.set("tenantid", activeUserRoleId)
headers.set("ocp-apim-subscription-key", API_SUB_KEY)
```

### Token Refresh Logic

```ts
// In JWT callback
if (tokenExpired(token)) {
    const refreshed = await refreshAccessToken(token)
    return refreshed || signOut() // Force re-auth if refresh fails
}
```

### 401 Retry Pattern

```ts
// In serverProxyFetch
if (response.status === 401 && !isRetry) {
    await checkAndRefreshToken()
    return proxyFetch(endpoint, { ...options, isRetry: true })
}
```

---

## Route Definitions Integration

### Centralized Auth Routes

```ts
// lib/routes/appRoutes.ts
export const appRoutes = {
    auth: {
        signIn: (locale?: iLocale) => (locale ? `/${locale}/auth/signin` : "/auth/signin"),
        error: (locale?: iLocale) => (locale ? `/${locale}/auth/error` : "/auth/error"),
        selectUserRole: (locale: iLocale) => `/${locale}/auth/select-user-role`
    },
    dashboard: {
        home: (locale: iLocale) => `/${locale}/dashboard`
    }
}
```

### Usage in Proxy

```ts
// Redirect to role selection if needed
if (isLoggedIn && needSelectRole && !isInSelectRole) {
    url.pathname = appRoutes.auth.selectUserRole(locale)
    return NextResponse.redirect(url)
}
```

---

## Environment Configuration

Required environment variables:

```bash
# Azure AD B2C
AUTH_AZURE_AD_B2C_ID=your-client-id
AUTH_AZURE_AD_B2C_SECRET=your-client-secret
AUTH_AZURE_AD_B2C_ISSUER=https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/v2.0/.well-known/openid_configuration
AUTH_AZURE_AD_B2C_AUTHORIZE=https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/oauth2/v2.0/authorize

# Session management
AUTH_SECRET=your-jwt-secret
AUTH_URL=http://localhost:3031/api/auth  # Base URL for auth endpoints
AUTH_SECURE_COOKIE=false  # true in production

# API integration
API_SUB_KEY=your-api-subscription-key
```

See [Environment Setup](../env.md) for complete configuration.

---

## Error Scenarios & Handling

| Scenario          | Response                                     | User Experience            |
| ----------------- | -------------------------------------------- | -------------------------- |
| No valid roles    | Redirect to `/auth/error?error=AccessDenied` | Access denied page         |
| Role not selected | Redirect to `/auth/select-user-role`         | Role selection form        |
| Token expired     | Silent refresh attempt → Sign out if fails   | Transparent or re-login    |
| API 401           | Retry once with fresh token                  | Seamless or error toast    |
| Network failure   | Standard error handling                      | Error toast + retry option |

---

## Security Considerations

### Client-side Protection

- Session data available to client components via React Context
- No sensitive tokens exposed to browser (handled server-side)
- CSRF protection via NextAuth.js built-in mechanisms

### Server-side Protection

- JWT verification on every server request
- Automatic token refresh with secure HTTP-only cookies
- API subscription keys never exposed to client
- Role-based tenant ID injection for multi-tenant isolation

### Route Protection

- Proxy runs on every request before page rendering
- Unauthorized redirects preserve intended destination
- Locale-aware authentication flow

---

## Testing Considerations

### Mocking Auth in Tests

```ts
// Mock NextAuth session
jest.mock("next-auth/react", () => ({
    useSession: () => ({
        data: { user: { id: "test", activeUserRoleId: "role1" } },
        status: "authenticated"
    })
}))

// Mock server auth
jest.mock("@/lib/auth", () => ({
    auth: () =>
        Promise.resolve({
            user: {
                /* test user */
            }
        })
}))
```

### Integration Testing

- Test role switching flows
- Verify token refresh scenarios
- Validate proxy redirects
- Check API auth header injection

---

## Common Patterns

### Conditional Rendering Based on Auth

```tsx
import { auth } from "@/lib/auth"

export default async function ConditionalComponent() {
    const session = await auth()
    const hasAdminRole = session?.user.roles.some(r => r.name === "Admin")

    return (
        <div>
            {hasAdminRole && <AdminPanel />}
            <UserContent />
        </div>
    )
}
```

### Programmatic Sign Out

```ts
import { signOut } from "@/lib/auth"

export async function handleSignOut() {
    await signOut({
        redirectTo: "/auth/signin",
        redirect: true
    })
}
```

### Protected API Route

```ts
// app/api/protected/route.ts
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ data: "Protected content" })
}
```

---

## Troubleshooting

### Common Issues

| Problem                    | Likely Cause                      | Solution                            |
| -------------------------- | --------------------------------- | ----------------------------------- |
| Infinite redirect loops    | Invalid locale in cookie          | Clear `user-locale` cookie          |
| 401 errors persist         | Token refresh failing             | Check Azure B2C configuration       |
| Role switching not working | JWT callback not handling updates | Verify `trigger === "update"` logic |
| Proxy not running          | Missing matcher config            | Add to `proxy.ts` config            |

### Debug Techniques

```ts
// Enable NextAuth debug logging
export default NextAuth({
    debug: process.env.NODE_ENV === "development",
    logger: {
        error: (code, metadata) => console.error(code, metadata),
        warn: code => console.warn(code)
    }
})
```

---

## Related Documentation

- [Environment Variables](../env.md) - Required configuration
- [Routing & Navigation](./routing-navigation.md) - Route protection integration
- [Data Access Layer](./data-access-layer.md) - API auth injection
- [Internationalization](./internationalization.md) - Locale-aware auth flow

---

[← Back to README](../../README.md)
