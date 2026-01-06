# Data Access Layer

Unified approach to API communication combining TanStack Query caching with proxyFetch networking and consistent error handling.

---

## Architecture Decision

This project uses a **hybrid data access pattern**:

1. **[TanStack Query](./query-pattern.md)** - Client-side caching, background refetch, loading states
2. **[proxyFetch](../../lib/api/proxyFetch/docs.md)** - Unified fetch wrapper with auth, headers, retry logic
3. **[Error Handling](../../Components/Error/ErrorHandler/docs.md)** - Consistent error parsing and user feedback

This separation allows each layer to excel at its primary concern while maintaining clean integration points.

---

## When to Use What

| Scenario                | Mechanism                                                | Rationale                               |
| ----------------------- | -------------------------------------------------------- | --------------------------------------- |
| Component data fetching | Query hook + proxyFetch                                  | Standard caching pattern                |
| Server-side data calls  | Direct proxyFetch                                        | No client cache needed                  |
| Form mutations          | Mutation hook + proxyFetch                               | Optimistic updates + cache invalidation |
| Debug API issues        | [testFetch](../../lib/api/testFetch/docs.md) temporarily | Bypass proxy layer                      |
| One-off calculations    | Direct function import                                   | No network needed                       |

---

## Standard Implementation Flow

### 1. Define API Hook (Colocated)

```ts
// File: Main/Dashboard/Resources/Home/api.ts
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

### 2. Use in Component

```tsx
// File: Main/Dashboard/Resources/Home/Home.tsx
import { useGetResources } from "./api"
import { SegmentError } from "@/Components/Error/ErrorHandler/SegmentError"

export default function ResourcesHome() {
    const { data, isLoading, error, refetch } = useGetResources({ pageSize: 20 })

    if (isLoading) return <div>Loading...</div>
    if (error) return <SegmentError error={error} refetch={refetch} />

    return <div>{/* Render data */}</div>
}
```

### 3. Mutation Example (Future Standard)

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useCreateResource() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (payload: CreateResourceInput) => {
            const res = await proxyFetch(apiRoute("B2B", "/Resources"), {
                method: "POST",
                body: payload
            })
            if (!res.ok) throw res
            return res.json()
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["resources"] })
        }
    })
}
```

---

## Integration Points

### Query Client Configuration

- Located: `lib/query/client.ts`
- Provides: Shared cache settings, retry policy, stale time defaults
- Used by: `lib/query/QueryProvider.tsx` wrapping app

### ProxyFetch Integration

- Handles: Server/client routing, auth headers, JSON serialization
- Error format: Throws `Response` objects for consistent parsing
- Security: Server-side only auth injection, subscription keys

### Error Flow

```
Response (non-2xx) → throw res → errorParser(res, locale) → { title, description[] }
                                         ↓
                               ┌─ errorToaster (toast)
                               ├─ SegmentError (inline + retry)
                               └─ ServerErrorHandler (full page)
```

---

## Checklist: New API Hook

- [ ] Colocated with consuming component in `api.ts`
- [ ] Endpoint built via `apiRoute(base, path, params)`
- [ ] Query key: `[resourcePlural, endpoint]` format
- [ ] Throws `Response` on `!res.ok`
- [ ] Types return value `as iResourceType`
- [ ] Consider `placeholderData` for smooth pagination
- [ ] Hook name: `useGetX` or `useX` pattern

---

## Future Enhancements

- Standardize mutation pattern across codebase
- Add server-side query prefetching examples
- Build shared `buildQueryKey()` utility
- Add automatic retry with exponential backoff
- Implement request deduplication for identical concurrent calls

---

## Related Documentation

- [Query Pattern Details](./query-pattern.md) - TanStack Query specifics
- [ProxyFetch Implementation](../../lib/api/proxyFetch/docs.md) - Network layer details
- [Error Handling System](../../Components/Error/ErrorHandler/docs.md) - User feedback patterns
- [Route Utilities](./routing-navigation.md) - API endpoint building

---

[← Back to README](../../README.md)
