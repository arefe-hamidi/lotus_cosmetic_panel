```markdown
# Query & Data Fetching Pattern

Authoritative guide for configuring TanStack Query and implementing standardized data hooks in this project.

---

## Purpose

Provide a consistent, typed, and cache-aware approach to requesting backend data via `proxyFetch`, while isolating service concerns (API routes, headers) from component logic.

## When to Use

- Any client component needing remote data that benefits from caching, background refetch, or status tracking.
- Read operations whose response shape is reused across multiple views.

Avoid for:

- Intra-module synchronous calculations (import functions directly instead).
- Server Actions where SSR streaming or form submission is primary (use action + optimistic UI).

---

## Structure
```

lib/query/
client.ts # QueryClient factory and defaults
QueryProvider.tsx # React context provider + devtools in dev

Main/.../api.ts # Domain-specific data hooks (colocated with UI)

````

Hooks live beside their consuming UI for discoverability while relying on globally shared query client configuration.

---

## Query Client Configuration (client.ts)
```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    },
    mutations: { retry: 1 }
  }
})
````

Rationale:

- `staleTime` reduces noisy refetches during quick navigation.
- `gcTime` balances memory vs reuse.
- Conservative retries mitigate transient network issues while surfacing persistent failures quickly.

---

## Hook Template

```ts
// File: Main/Dashboard/Resource/Home/api.ts
import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch"
import { apiRoute } from "@/lib/routes/utils"
import { useQuery } from "@tanstack/react-query"
import type { iParams } from "@/lib/routes/types"
import type { iResources } from "./types"

export function useGetResources(params: iParams) {
    const endpoint = apiRoute("B2B", "/Resources", params)
    return useQuery({
        queryKey: ["resources", endpoint],
        queryFn: async () => {
            const res = await proxyFetch(endpoint)
            if (!res.ok) throw res
            return (await res.json()) as iResources
        },
        placeholderData: prevData => prevData
    })
}
```

### Required Elements

- `endpoint` built via `apiRoute(base, path, params)` – never hardcode query strings manually.
- `queryKey` stable array: `[semanticNamePlural, endpoint]`.
- Throw the raw `Response` (`if (!res.ok) throw res`) for centralized error parsing.
- Cast parsed data to local types.
- `placeholderData` carries previous page/filter results to reduce UI flicker.

### Optional Extensions

- Additional key parts: For POST-as-query patterns include a JSON-stringified body segment.
- `select` to derive lightweight view models.
- `enabled` for conditional queries (wait for required params).

---

## Query Key Strategy

Pattern: `[resourcePlural, endpoint, optionalBodyHash]`

Rules:

1. First item: stable semantic identifier (lowercase plural).
2. Second item: fully resolved endpoint string (includes query params produced by `apiRoute`).
3. Body-bearing read requests: append `JSON.stringify(body)` safely inside a try/catch.

Good:

```ts
queryKey: ["userAccounts", endpoint]
queryKey: ["serviceLogHistory", endpoint, JSON.stringify(body)]
```

Avoid:

```ts
queryKey: [endpoint] // Loses semantic meaning
queryKey: ["users", userId] // Mixing scalar with string endpoint fragments
```

---

## Mutations Pattern (Future Standard)

Not yet widely implemented; recommended template:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useCreateResource() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (payload: iCreateResourceInput) => {
            const res = await proxyFetch(apiRoute("B2B", "/Resources"), {
                method: "POST",
                body: payload
            })
            if (!res.ok) throw res
            return res.json() as Promise<iResource>
        },
        onSuccess: _created => {
            qc.invalidateQueries({ queryKey: ["resources"] })
        }
    })
}
```

---

## Error Handling

Throwing `Response` objects lets UI layers use existing helpers:

- `errorToaster(error)` for mutation or user-triggered fetches.
- `<SegmentError error={error} />` for section reload affordance.

Markers parsed by `errorParser` remain consistent across queries & mutations.

---

## Decision Matrix: Fetch Mechanism

| Scenario                      | Mechanism                            | Notes                  |
| ----------------------------- | ------------------------------------ | ---------------------- |
| Cached list/detail data       | Query hook + `proxyFetch`            | Standard pattern       |
| Debug failing request         | Temporarily `testFetch`              | Revert afterward       |
| One-off server-side only call | Direct `proxyFetch` in Server Action | No client cache needed |
| Highly dynamic streaming      | Raw `fetch`                          | Manual control         |

---

## Do / Avoid

| Do                                        | Avoid                                 |
| ----------------------------------------- | ------------------------------------- |
| Co-locate hook with consuming UI `api.ts` | Barrel re-export renaming hooks       |
| Use semantic plural first in `queryKey`   | Using raw endpoint as sole key        |
| Invalidate on mutation success            | Manual deep cache editing prematurely |
| Keep placeholderData simple               | Complex data cloning logic            |

---

## Checklist (New Hook)

- [ ] Endpoint via `apiRoute`
- [ ] Stable `queryKey` `[namePlural, endpoint]`
- [ ] Throws `Response` on `!res.ok`
- [ ] Typed return (`as iX`)
- [ ] Optional `placeholderData` if flicker undesirable
- [ ] Name pattern `useGetX` / `useX`

---

## Future Improvements

- Shared `buildQueryKey(resource, params, body?)` utility.
- Automatic response JSON parsing helper.
- Server-side prefetch + hydration example.

---

[< back](/README.md)

```

```
