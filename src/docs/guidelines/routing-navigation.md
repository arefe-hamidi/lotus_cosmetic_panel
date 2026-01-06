# Routing & Navigation

Centralized route management with type-safe builders, locale-aware navigation, and API endpoint construction.

---

## Overview

The routing system provides:

- **Centralized Route Definitions**: Single source of truth for all app routes
- **Type-safe Route Builders**: Compile-time validation of route parameters
- **Locale-aware Navigation**: Automatic locale prefix handling
- **API Endpoint Construction**: Consistent API URL building with query parameters
- **Tab Route Management**: URL-based tab state with query parameter support

---

## Core Components

### 1. App Routes (`lib/routes/appRoutes.ts`)

Centralized definition of all application routes:

```ts
export const appRoutes = {
    auth: {
        signIn: (locale?: iLocale) => (locale ? `/${locale}/auth/signin` : "/auth/signin"),
        selectUserRole: (locale: iLocale) => `/${locale}/auth/select-user-role`
    },
    dashboard: {
        home: (locale: iLocale) => `/${locale}/dashboard`,
        settings: (locale: iLocale, tab?: string) => tabRoute(`/${locale}/dashboard/settings`, tab),
        services: {
            customers: {
                root: (locale: iLocale) => `/${locale}/dashboard/services/customers`,
                details: (locale: iLocale, customerId: string, tab?: string) =>
                    tabRoute(`/${locale}/dashboard/services/customers/${customerId}`, tab)
            }
        }
    }
}
```

### 2. Route Utilities (`lib/routes/utils.ts`)

Utility functions for building routes and API endpoints:

```ts
// API endpoint construction
export function apiRoute(
    apiBasePathKey: keyof typeof API_BASE_PATH,
    path: string,
    params?: iSearchParams
): string

// Tab-aware route building
export function tabRoute(pageRoute: string, tab?: string): string

// Generic route with query parameters
export function buildRoute(path: string, params?: iSearchParams): string
```

### 3. Route Constants (`lib/routes/constants.ts`)

```ts
export const API_BASE_PATH = {
    B2B: "/api/b2b/v1",
    MEDIA: "/api/media/v1"
    // ... other service bases
} as const

export const TAB_KEY = "tab"
```

---

## Usage Patterns

### Navigation in Components

```tsx
import Link from "next/link"
import { appRoutes } from "@/lib/routes/appRoutes"
import { useParams } from "next/navigation"

export function NavigationMenu() {
    const { locale } = useParams<{ locale: iLocale }>()

    return (
        <nav>
            <Link href={appRoutes.dashboard.home(locale)}>Dashboard</Link>
            <Link href={appRoutes.dashboard.services.customers.root(locale)}>Customers</Link>
        </nav>
    )
}
```

### Programmatic Navigation

```tsx
"use client"
import { useRouter, useParams } from "next/navigation"
import { appRoutes } from "@/lib/routes/appRoutes"

export function useAppNavigation() {
    const router = useRouter()
    const { locale } = useParams<{ locale: iLocale }>()

    return {
        goToCustomer: (customerId: string) => {
            router.push(appRoutes.dashboard.services.customers.details(locale, customerId))
        },
        goToCustomerTab: (customerId: string, tab: string) => {
            router.push(appRoutes.dashboard.services.customers.details(locale, customerId, tab))
        }
    }
}
```

### API Endpoint Construction

```ts
import { apiRoute } from "@/lib/routes/utils"

// Simple endpoint
const endpoint = apiRoute("B2B", "/Customers")
// → "/api/b2b/v1/Customers"

// With query parameters
const endpoint = apiRoute("B2B", "/Customers", {
    pageSize: 20,
    search: "acme"
})
// → "/api/b2b/v1/Customers?pageSize=20&search=acme"

// With path parameters and query
const endpoint = apiRoute("B2B", `/Customers/${customerId}/objects`, {
    customerId: "123"
})
// → "/api/b2b/v1/Customers/456/objects?customerId=123"
```

---

## Tab Route Management

### URL-based Tab State

```ts
import { tabRoute } from "@/lib/routes/utils"

// Create tab-aware route
const settingsWithTab = tabRoute("/en/dashboard/settings", "account")
// → "/en/dashboard/settings?tab=account"

// Use in Link component
<Link href={appRoutes.dashboard.settings(locale, "billing")}>
    Billing Settings
</Link>
```

### Reading Tab State

```tsx
"use client"
import { useSearchParams } from "next/navigation"
import { TAB_KEY } from "@/lib/routes/constants"

export function TabComponent() {
    const searchParams = useSearchParams()
    const activeTab = searchParams.get(TAB_KEY) || "overview"

    return <div>Active tab: {activeTab}</div>
}
```

---

## Locale Integration

### Route Structure

All user-facing routes include locale prefix:

```
/en/dashboard              ← English dashboard
/de/dashboard              ← German dashboard
/en/dashboard/customers    ← English customers page
/de/dashboard/customers    ← German customers page
```

### Locale Handling in Routes

```ts
// Optional locale for flexibility
signIn: (locale?: iLocale) => (locale ? `/${locale}/auth/signin` : "/auth/signin")

// Required locale for user routes
home: (locale: iLocale) => `/${locale}/dashboard`

// Usage in proxy
const isOnDashboard = pathname.indexOf(appRoutes.dashboard.home(locale)) !== -1
```

### Locale-aware Redirects

```ts
// In auth proxy
if (isLoggedIn && isOnSignIn) {
    url.pathname = appRoutes.dashboard.home(locale)
    return NextResponse.redirect(url)
}
```

---

## Integration with Other Systems

### Authentication Proxy

```ts
// lib/auth/auth.ts - authorized callback
const isOnDashboard = pathname.indexOf(appRoutes.dashboard.home(locale)) !== -1
if (isOnDashboard) return isLoggedIn

const isOnSignIn = pathname.indexOf(appRoutes.auth.signIn(locale)) !== -1
if (isLoggedIn && isOnSignIn) {
    url.pathname = appRoutes.dashboard.home(locale)
    return NextResponse.redirect(url)
}
```

### Data Fetching Hooks

```ts
// API hooks use apiRoute for consistent endpoint building
export function useGetCustomers(params: iParams) {
    const endpoint = apiRoute("B2B", "/Customers", params)
    return useQuery({
        queryKey: ["customers", endpoint],
        queryFn: async () => {
            const res = await proxyFetch(endpoint)
            // ...
        }
    })
}
```

### Form Actions

```ts
"use server"
import { redirect } from "next/navigation"
import { appRoutes } from "@/lib/routes/appRoutes"

export async function createCustomer(formData: FormData) {
    // ... create customer logic
    const locale = getLocaleFromHeaders() // utility function
    redirect(appRoutes.dashboard.services.customers.details(locale, newCustomerId))
}
```

---

## Type Safety

### Route Parameter Validation

```ts
// Types ensure required parameters are provided
appRoutes.dashboard.services.customers.details(locale, customerId) // ✅ All required params
appRoutes.dashboard.services.customers.details(locale) // ❌ TypeScript error - missing customerId
```

### API Base Path Constraints

```ts
// Only valid API base paths accepted
apiRoute("B2B", "/Customers") // ✅ Valid
apiRoute("INVALID", "/Customers") // ❌ TypeScript error
```

### Search Parameter Types

```ts
interface iSearchParams {
    [key: string]: string | number | boolean | undefined
}

// Ensures query parameters are serializable
apiRoute("B2B", "/Customers", {
    pageSize: 20, // ✅ number
    active: true, // ✅ boolean
    search: "term", // ✅ string
    filter: undefined // ✅ undefined (excluded from query)
})
```

---

## Best Practices

### Route Definition Guidelines

```ts
// ✅ Good: Function-based with required parameters
customers: {
    details: (locale: iLocale, customerId: string, tab?: string) =>
        tabRoute(`/${locale}/dashboard/customers/${customerId}`, tab)
}

// ❌ Avoid: Static strings requiring manual parameter substitution
customers: {
    details: "/dashboard/customers/{customerId}"
}
```

### Consistent API Endpoint Building

```ts
// ✅ Good: Use apiRoute consistently
const endpoint = apiRoute("B2B", "/Customers", params)

// ❌ Avoid: Manual URL construction
const endpoint = `/api/b2b/v1/Customers?${new URLSearchParams(params)}`
```

### Tab State Management

```ts
// ✅ Good: URL-based tab state (shareable, refreshable)
<Link href={appRoutes.dashboard.settings(locale, "billing")}>

// ❌ Avoid: Component state for tabs (not shareable)
const [activeTab, setActiveTab] = useState("billing")
```

---

## Error Prevention

### Route Changes Detection

When route structure changes:

1. TypeScript errors surface immediately in components using old routes
2. Fix all compilation errors before deployment
3. Consider backward compatibility for bookmarked URLs

### Query Parameter Handling

```ts
// Handle undefined gracefully
Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
        searchParams.set(key, value.toString())
    } else {
        searchParams.delete(key) // Clean up undefined params
    }
})
```

---

## Testing Strategies

### Route Builder Testing

```ts
describe("appRoutes", () => {
    it("builds customer details route correctly", () => {
        const route = appRoutes.dashboard.services.customers.details("en", "cust-123", "billing")
        expect(route).toBe("/en/dashboard/services/customers/cust-123?tab=billing")
    })
})
```

### Navigation Testing

```tsx
import { render, screen } from "@testing-library/react"
import { useRouter } from "next/navigation"

// Mock useRouter for navigation testing
jest.mock("next/navigation", () => ({
    useRouter: jest.fn()
}))

test("navigates to customer details", () => {
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })

    // ... test component that uses navigation
    // ... assert mockPush called with correct route
})
```

---

## Migration Guide

### From Hardcoded Routes

```ts
// Before: Hardcoded strings
<Link href="/dashboard/customers">Customers</Link>
router.push(`/dashboard/customers/${id}`)

// After: Centralized routes
<Link href={appRoutes.dashboard.services.customers.root(locale)}>Customers</Link>
navigation.goToCustomer(id)
```

### Adding New Routes

1. Define in `appRoutes` object with appropriate nesting
2. Add TypeScript types if new parameter patterns introduced
3. Update any related proxy or auth checks
4. Test route generation and navigation

---

## Related Documentation

- [Internationalization](./internationalization.md) - Locale handling in routes
- [Auth & Session Pattern](./auth-session-pattern.md) - Route protection integration
- [Data Access Layer](./data-access-layer.md) - API endpoint construction usage
- [Import/Export Rules](./import-export.md) - Module organization for routes

---

[← Back to README](../../README.md)
