# Contributor Checklist Template

Use this checklist when adding new features, patterns, or documentation to ensure consistency with project guidelines.

---

## New API Hook Checklist

- [ ] Hook colocated with consuming component in `api.ts` file
- [ ] Endpoint built via `apiRoute(base, path, params)` utility
- [ ] Query key follows `[resourcePlural, endpoint]` format
- [ ] Throws `Response` object on `!res.ok` for consistent error handling
- [ ] Return type cast with `as iResourceType`
- [ ] Consider `placeholderData: prevData => prevData` for smooth UX
- [ ] Hook named with `useGetX` or `useX` pattern
- [ ] Import types from colocated `types.ts` or global types
- [ ] No duplicate functionality with existing hooks

## New Component Checklist

- [ ] Component file named in PascalCase (e.g., `CustomerCard.tsx`)
- [ ] Directory structure follows fractal modular pattern
- [ ] Props interface named `iProps` and defined above component
- [ ] Component exported as default with function declaration syntax
- [ ] Only one component per file
- [ ] No constants, utilities, or types exported from component file
- [ ] Uses Shadcn primitives when possible
- [ ] Follows responsive design patterns
- [ ] Includes proper accessibility attributes
- [ ] TypeScript types properly defined and imported

## New Route Checklist

- [ ] Route added to `appRoutes` object in `lib/routes/appRoutes.ts`
- [ ] Function-based route definition with required parameters
- [ ] Locale parameter included for user-facing routes
- [ ] Tab parameter handled via `tabRoute()` utility when needed
- [ ] Route tested in both development and build modes
- [ ] No hardcoded route strings in components
- [ ] Proxy updated (proxy.ts) if route requires auth protection
- [ ] Related navigation components updated

## New i18n Module Checklist

- [ ] `i18n.ts` file created in module directory
- [ ] Dictionary objects for all supported locales (en, de)
- [ ] `satisfies` constraint used for type safety
- [ ] `getDictionaryGenerator` used for dictionary function
- [ ] Key structure consistent across all locales
- [ ] SEO keys included if needed (`seo.title`, `seo.description`)
- [ ] Placeholder key included if LanguageSwitcher select mode used
- [ ] FUT tool run to verify no unused keys introduced
- [ ] Dictionary usage follows server/client component patterns

## Documentation Checklist

- [ ] New pattern documented in appropriate guideline file
- [ ] README.md updated with links to new documentation
- [ ] Cross-references added to related documentation files
- [ ] Code examples include proper imports and types
- [ ] Examples tested and verified to work
- [ ] Consistent formatting and style with existing docs
- [ ] No duplication with existing documentation
- [ ] Related troubleshooting section updated if applicable

## Error Handling Checklist

- [ ] Errors thrown as `Response` objects for API failures
- [ ] `errorToaster` used for user-triggered mutations
- [ ] `SegmentError` used for component-level failures
- [ ] `ServerErrorHandler` used for server-side blocking errors
- [ ] Error messages localized if user-facing
- [ ] Proper error boundaries in place
- [ ] Loading and error states handled in UI
- [ ] Network failures handled gracefully

## TypeScript Checklist

- [ ] Types defined in fractal `types.ts` files or separate type files
- [ ] Interface names prefixed with `i` (e.g., `iCustomer`)
- [ ] Type definitions follow established naming conventions
- [ ] No `any` types used (prefer `unknown` with type guards)
- [ ] Proper type imports/exports (no default exports for types)
- [ ] Generic types properly constrained
- [ ] Utility types used appropriately
- [ ] Type definitions exported from appropriate module

## Performance Checklist

- [ ] Images optimized and properly sized
- [ ] Components memoized if expensive re-renders expected
- [ ] Large components lazy-loaded when appropriate
- [ ] Query hooks include proper cache invalidation strategy
- [ ] No unnecessary API calls in render loops
- [ ] Proper loading states to prevent layout shift
- [ ] Bundle size impact considered for new dependencies

## Testing Checklist

- [ ] Unit tests added for new utility functions
- [ ] Component tests verify basic rendering and interactions
- [ ] API hooks mocked appropriately in tests
- [ ] Error scenarios tested
- [ ] Accessibility tested with screen readers
- [ ] Mobile responsiveness verified
- [ ] Theme switching tested if UI components
- [ ] Internationalization tested with different locales

## Code Quality Checklist

- [ ] ESLint passes without warnings
- [ ] Prettier formatting applied
- [ ] TypeScript compilation successful
- [ ] No console.log statements in production code
- [ ] Proper error logging where appropriate
- [ ] Code follows established naming conventions
- [ ] Imports organized according to import/export rules
- [ ] No circular dependencies introduced

## Git Checklist

- [ ] Branch follows naming convention: `<type>/<task-id>-<description>`
- [ ] Commits follow conventional commit format
- [ ] Commit messages are descriptive and include task ID
- [ ] Branch up to date with main before creating PR
- [ ] No sensitive information in commit history
- [ ] Large files properly handled with Git LFS if needed
- [ ] .gitignore updated for new build artifacts if applicable

## Deployment Checklist

- [ ] Environment variables documented if new ones added
- [ ] Build process succeeds in production mode
- [ ] New dependencies added to package.json with proper versions
- [ ] Database migrations created if schema changes
- [ ] Feature flags considered for gradual rollout
- [ ] Rollback strategy planned for breaking changes
- [ ] Performance impact assessed
- [ ] Security implications reviewed

---

## Quick Reference Commands

```bash
# Run FUT tool
pnpm run fut

# Check TypeScript
pnpm run type-check

# Lint code
pnpm run lint

# Format code
pnpm run format

# Build project
pnpm run build

# Run tests
pnpm run test
```

---

## Common Patterns Quick Reference

### API Hook Template

```ts
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

### Component Template

```tsx
interface iProps {
    title: string
    children: React.ReactNode
}

export default function CustomCard({ title, children }: iProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
```

### Route Definition Template

```ts
resources: {
    root: (locale: iLocale) => `/${locale}/dashboard/resources`,
    details: (locale: iLocale, id: string, tab?: string) =>
        tabRoute(`/${locale}/dashboard/resources/${id}`, tab)
}
```

---

[← Back to README](../../README.md)
