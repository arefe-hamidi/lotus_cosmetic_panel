# Testing Guidelines

This project uses [Vitest](https://vitest.dev/) as the testing framework for unit tests. This guide covers testing conventions, patterns, and best practices.

## Test Framework Setup

### Configuration

Tests are configured via `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        exclude: ["node_modules", "dist", ".next"]
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, ".")
        }
    },
    esbuild: {
        target: "node18"
    },
    define: {
        "process.env.VITEST": '"true"'
    }
})
```

**Key points:**

- `globals: true` enables `describe`, `it`, `expect` without imports
- `environment: "node"` for Node.js environment (not DOM)
- Path alias `@` resolves to project root (same as TypeScript config)
- `VITEST` env var is set for conditional PostCSS config

## Test File Naming

Test files must follow one of these patterns:

- `*.test.ts` or `*.test.tsx`
- `*.spec.ts` or `*.spec.tsx`

Place test files **next to** the code they test:

```
lib/
  routes/
    utils.ts
    utils.test.ts    ← Test file
```

## Running Tests

```bash
# Watch mode (development)
pnpm test

# Run once
pnpm test:run

# Run with coverage
pnpm test:coverage
```

## Test Structure

### Basic Test Structure

```typescript
import { describe, it, expect } from "vitest"
import { functionToTest } from "./module"

describe("functionToTest", () => {
    it("should do something", () => {
        const result = functionToTest(input)
        expect(result).toBe(expected)
    })
})
```

### Using Globals

With `globals: true`, you can use `describe`, `it`, `expect` without importing:

```typescript
// ✅ Good - globals enabled
describe("myFunction", () => {
    it("should work", () => {
        expect(true).toBe(true)
    })
})

// ❌ Unnecessary - globals are enabled
import { describe, it, expect } from "vitest"
```

However, if you need other Vitest utilities (`vi`, `beforeEach`, `afterEach`), import them:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest"
```

## Mocking Patterns

### Mocking Modules

Use `vi.mock()` to mock modules. **Mocks must be hoisted** (before imports):

```typescript
// Mock must be before imports
vi.mock("./clientProxyFetch", () => ({
    clientProxyFetch: vi.fn()
}))

vi.mock("../../configs/constants", () => ({
    IS_SERVER: false
}))

// Now import
import { proxyFetch } from "./proxyFetch"
import { clientProxyFetch } from "./clientProxyFetch"
```

### Mocking Functions

```typescript
import { vi } from "vitest"

// Mock a function
const mockFn = vi.fn()
mockFn.mockReturnValue("result")
mockFn.mockResolvedValue(Promise.resolve("async result"))

// Check calls
expect(mockFn).toHaveBeenCalledWith(arg1, arg2)
expect(mockFn).toHaveBeenCalledTimes(1)
```

### Mocking with vi.mocked()

Type-safe mocking with TypeScript:

```typescript
import { vi } from "vitest"

vi.mocked(clientProxyFetch).mockResolvedValue(new Response())
expect(clientProxyFetch).toHaveBeenCalledWith("/api/test", expect.any(Object))
```

### Cleanup

Always clean up mocks between tests:

```typescript
describe("myModule", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })
})
```

## Path Aliases

Tests use the same `@/` path alias as the main codebase:

```typescript
// ✅ Good - use path alias
import type { iLocale } from "@/Components/Entity/Locale/types"
import { buildRoute } from "@/lib/routes/utils"

// ❌ Avoid - relative paths
import type { iLocale } from "../../../Components/Entity/Locale/types"
```

The alias is configured in `vitest.config.ts` to resolve to the project root.

## Type Assertions in Tests

When creating test data for complex types, use type assertions instead of type annotations:

```typescript
// ✅ Good - type assertion
const mockData = {
    totalCount: 1,
    currentPage: 1
    // ... other fields
} as iFindingOverview

// ❌ Problematic - TypeScript may not recognize extended interface properties
const mockData: iFindingOverview = {
    totalCount: 1 // Error: 'totalCount' does not exist in type
    // ...
}
```

This is especially important for types that extend other interfaces.

## Testing Utilities

### Testing Route Utilities

```typescript
import { describe, it, expect } from "vitest"
import { buildRoute } from "./utils"

describe("buildRoute", () => {
    it("should build route with query params", () => {
        const result = buildRoute("/dashboard", { tags: ["tag1", "tag2"] })
        expect(result).toBe("/dashboard?tags=tag1%2Ctag2%2Ctag3")
    })
})
```

### Testing API Functions

```typescript
import { vi, beforeEach } from "vitest"

vi.mock("./clientProxyFetch", () => ({
    clientProxyFetch: vi.fn()
}))

describe("proxyFetch", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should call clientProxyFetch", async () => {
        vi.mocked(clientProxyFetch).mockResolvedValue(new Response())
        await proxyFetch("/api/test")
        expect(clientProxyFetch).toHaveBeenCalled()
    })
})
```

### Testing Auth Utilities

```typescript
import { describe, it, expect } from "vitest"
import { isValidIpForRole } from "./ipValidation"
import type { User } from "next-auth"

describe("isValidIpForRole", () => {
    it("should validate IP address", () => {
        const user = { ipAddress: "192.168.1.1" } as User & { ipAddress?: string }
        const result = isValidIpForRole(user, "192.168.1.0/24")
        expect(result).toBe(true)
    })
})
```

## Environment-Specific Configuration

### PostCSS Configuration

The `postcss.config.mjs` returns an empty plugins array during tests:

```javascript
const config =
    process.env.VITEST || process.env.NODE_ENV === "test"
        ? { plugins: [] }
        : { plugins: ["@tailwindcss/postcss"] }
export default config
```

This prevents Vitest from failing on PostCSS plugins it doesn't understand.

### TypeScript Configuration

Test files are excluded from Next.js compilation in `tsconfig.json`:

```json
{
    "exclude": [
        "node_modules",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "vitest.config.ts"
    ]
}
```

## Best Practices

### 1. Test Organization

- **One test file per source file** (e.g., `utils.ts` → `utils.test.ts`)
- **Group related tests** using `describe` blocks
- **Use descriptive test names** that explain what is being tested

```typescript
describe("buildRoute", () => {
    describe("with query parameters", () => {
        it("should handle string values", () => {
            /* ... */
        })
        it("should handle array values", () => {
            /* ... */
        })
    })

    describe("without query parameters", () => {
        it("should return path as-is", () => {
            /* ... */
        })
    })
})
```

### 2. Test Data

- **Use realistic test data** that matches production scenarios
- **Create helper functions** for common test data patterns
- **Use type assertions** for complex types (see above)

### 3. Assertions

- **Be specific** in assertions - test exact values, not just truthiness
- **Test edge cases** - empty arrays, null values, boundary conditions
- **Test error cases** - invalid inputs, network failures, etc.

### 4. Mocking

- **Mock at module boundaries** - don't mock internal implementation details
- **Mock external dependencies** - APIs, file system, environment variables
- **Clean up mocks** between tests using `beforeEach`/`afterEach`

### 5. Coverage

Aim for:

- **High coverage** on utility functions and business logic
- **Critical path coverage** for authentication, routing, API calls
- **Edge case coverage** for error handling and validation

## Common Patterns

### Testing Async Functions

```typescript
it("should handle async operations", async () => {
    const result = await asyncFunction()
    expect(result).toBe(expected)
})
```

### Testing Error Cases

```typescript
it("should throw error on invalid input", () => {
    expect(() => {
        functionWithValidation(invalidInput)
    }).toThrow("Expected error message")
})
```

### Testing with Dates

```typescript
it("should format dates correctly", () => {
    const date = new Date("2024-01-15")
    const formatted = formatDate(date)
    expect(formatted).toBe("2024-01-15")
})
```

## Examples

See existing test files for reference:

- `lib/routes/utils.test.ts` - Route utility tests
- `lib/auth/utils/ipValidation.test.ts` - Auth utility tests
- `lib/api/proxyFetch/proxyFetch.test.ts` - API function tests
- `Components/Common/FindingChartCard/utils.test.ts` - Component utility tests

&nbsp;

&nbsp;

[< back](/README.md)
