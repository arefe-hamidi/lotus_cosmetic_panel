# Internationalization (i18n)

Comprehensive multi-language support with dictionary management, locale detection, and automated translation cleanup.

---

## Overview

The i18n system provides:

- **Multi-language Support**: English and German with extensible architecture
- **Fractal Dictionary Pattern**: Module-specific translations with shared utilities
- **Locale Detection & Switching**: Cookie persistence + URL-based locale routing
- **FUT Cleanup Tool**: Automated unused translation key discovery and removal
- **SSR/CSR Compatibility**: Consistent locale handling across rendering modes

---

## Architecture Components

### 1. Core Locale System (`Components/Entity/Locale/`)

```
Components/Entity/Locale/
├── constants.ts          # LOCALES, DEFAULT_LOCALE, cookie settings
├── types.ts             # iLocale, dictionary interfaces
├── utils.ts             # Path parsing, cookie management, dictionary generator
├── LanguageSwitcher.tsx # Client component for locale selection
└── fut/                 # Find Unused Translations tool
```

### 2. Supported Locales (`constants.ts`)

```ts
export const LOCALES = ["en", "de"] as const
export const DEFAULT_LOCALE: iLocale = "en"
export const LOCALE_FULLNAME: Record<iLocale, string> = {
    en: "English",
    de: "Deutsch"
}
```

### 3. Dictionary Structure Pattern

Each module defines its own `i18n.ts` file:

```ts
// Example: Main/Dashboard/Customers/i18n.ts
import { getDictionaryGenerator } from "@/Components/Entity/Locale/utils"
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types"

const en = {
    seo: {
        title: "Customer Management",
        description: "Manage your customer relationships"
    },
    title: "Customers",
    actions: {
        add: "Add Customer",
        edit: "Edit Customer",
        delete: "Delete Customer"
    },
    placeholders: {
        search: "Search customers..."
    }
} satisfies iDictionaryBaseStructure

const de = {
    seo: {
        title: "Kundenverwaltung",
        description: "Verwalten Sie Ihre Kundenbeziehungen"
    },
    title: "Kunden",
    actions: {
        add: "Kunde hinzufügen",
        edit: "Kunde bearbeiten",
        delete: "Kunde löschen"
    },
    placeholders: {
        search: "Kunden suchen..."
    }
} satisfies typeof en

export type iDictionary = typeof en
export const getDictionary = getDictionaryGenerator({ en, de })
```

---

## Usage Patterns

### Server Components

```tsx
// Server-side dictionary access
import { getDictionary } from "./i18n"
import type { iLocale } from "@/Components/Entity/Locale/types"

interface Props {
    params: { locale: iLocale }
}

export default async function CustomersPage({ params }: Props) {
    const dictionary = getDictionary(params.locale)

    return (
        <div>
            <h1>{dictionary.title}</h1>
            <p>{dictionary.seo.description}</p>
        </div>
    )
}
```

### Client Components

```tsx
"use client"
import { useParams } from "next/navigation"
import { getDictionary } from "./i18n"
import type { iLocale } from "@/Components/Entity/Locale/types"

export function CustomerActions() {
    const { locale } = useParams<{ locale: iLocale }>()
    const dictionary = getDictionary(locale)

    return (
        <div>
            <button>{dictionary.actions.add}</button>
            <button>{dictionary.actions.edit}</button>
        </div>
    )
}
```

### Utility Functions with Dictionaries

```ts
// Pass dictionary as parameter for testability
import type { iDictionary } from "./i18n"

export function generateSeoMetadata(dictionary: iDictionary) {
    return {
        title: dictionary.seo.title,
        description: dictionary.seo.description
    }
}

// Usage in page component
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const dictionary = getDictionary(params.locale)
    return generateSeoMetadata(dictionary)
}
```

---

## Locale Detection & Routing

### URL Structure

All user routes include locale prefix:

```
/en/dashboard/customers    ← English
/de/dashboard/customers    ← German
/dashboard/customers       ← Redirects to /en/dashboard/customers
```

### Locale Detection Logic (`utils.ts`)

```ts
// Extract locale from pathname
export function getLocaleFromPathname(pathname: string): iLocale

// Remove locale prefix and validate
export function removeLocaleFromPathname(pathname: string): iRemovedLocale

// Cookie-based locale persistence
export function getLocaleFromCookie(): iLocale | null
export function setLocaleToCookie(locale: iLocale): void

// Request negotiation (cookie → Accept-Language → default)
export function getLocaleFromRequest(request: NextRequest): iLocale
```

### Proxy Integration

```ts
// In auth proxy (lib/auth/auth.ts)
const pathnameHasLocale = hasValidLocal(pathname)
if (!pathnameHasLocale) {
    return addLocaleToRequest(pathname, request) // Redirect with locale
}
```

---

## Language Switching

### LanguageSwitcher Component

```tsx
import { LanguageSwitcher } from "@/Components/Entity/Locale/LanguageSwitcher"

// Button variant (default)
<LanguageSwitcher appearance="button" />

// Select dropdown variant
<LanguageSwitcher appearance="select" className="w-40" />
```

### Manual Locale Switching

```tsx
"use client"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { setLocaleToCookie } from "@/Components/Entity/Locale/utils"

export function useLocaleSwitch() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()

    return (newLocale: iLocale) => {
        // Update cookie
        setLocaleToCookie(newLocale)

        // Build new path with updated locale
        const currentPath = window.location.pathname
        const newPath = currentPath.replace(`/${params.locale}`, `/${newLocale}`)
        const queryString = searchParams.toString()
        const fullPath = queryString ? `${newPath}?${queryString}` : newPath

        // Navigate with query preservation
        router.push(fullPath)
    }
}
```

---

## FUT (Find Unused Translations) Tool

Automated discovery and cleanup of unused translation keys.

### Running FUT

```bash
# Standard analysis
pnpm run fut

# JSON output for CI
pnpm run fut -- --json

# Cleanup unused keys (with backup)
pnpm run fut -- --cleanup --keep-backups

# Dry run (see what would be removed)
pnpm run fut -- --cleanup --dry-run
```

### FUT Configuration

Create `.fut.ignore` to exclude paths or specific keys:

```
# Ignore directories
node_modules/
dist/
.next/

# Ignore specific keys in files
Components/Entity/Roles/i18n.ts::roleCode.*
Main/Dashboard/Legacy/i18n.ts::deprecated.*
```

### FUT Detection Patterns

FUT finds usage through multiple heuristics:

```ts
// Direct access
dictionary.title
dictionary.seo.title

// Optional chaining
dictionary?.actions?.add

// Bracket notation
dictionary["actions.add"]
dictionary["seo.title"]

// Destructuring
const { title, actions } = dictionary
const { add: addButton } = dictionary.actions
// Template literals
`${dictionary.seo.title}`
```

---

## Adding New Languages

### 1. Update Core Configuration

```ts
// Components/Entity/Locale/constants.ts
export const LOCALES = ["en", "de", "fr"] as const // Add "fr"

export const LOCALE_FULLNAME: Record<iLocale, string> = {
    en: "English",
    de: "Deutsch",
    fr: "Français" // Add French
}
```

### 2. Add Translations to All Modules

```ts
// In each module's i18n.ts file
const fr = {
    seo: {
        title: "Gestion des clients",
        description: "Gérez vos relations clients"
    },
    title: "Clients",
    actions: {
        add: "Ajouter un client",
        edit: "Modifier le client",
        delete: "Supprimer le client"
    }
} satisfies typeof en

export const getDictionary = getDictionaryGenerator({ en, de, fr })
```

### 3. Update LanguageSwitcher

If using select mode, ensure `placeholder` key exists in all locales:

```ts
const en = {
    // ... other keys
    placeholder: "Select language"
}

const de = {
    // ... other keys
    placeholder: "Sprache wählen"
}

const fr = {
    // ... other keys
    placeholder: "Choisir la langue"
}
```

---

## Date & Number Localization

### Locale-aware Date Formatting

```ts
import { getLocalDate } from "@/Components/Entity/Locale/utils"

// Format date according to locale
const formattedDate = getLocalDate(new Date(), "de") // German format
const formattedDateTime = getLocalDate(new Date(), "en", true) // English with time
```

### Number Formatting

```ts
// Manual number formatting per locale
export function formatNumber(value: number, locale: iLocale): string {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "de-DE").format(value)
}

export function formatCurrency(amount: number, locale: iLocale): string {
    const currency = locale === "en" ? "USD" : "EUR"
    const localeCode = locale === "en" ? "en-US" : "de-DE"

    return new Intl.NumberFormat(localeCode, {
        style: "currency",
        currency
    }).format(amount)
}
```

---

## SSR/CSR Considerations

### Server-side Locale Access

```tsx
// In layout.tsx or page components
export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: { locale: iLocale }
}) {
    const dictionary = getDictionary(params.locale)

    return (
        <html lang={params.locale}>
            <head>
                <title>{dictionary.seo.title}</title>
                <meta name="description" content={dictionary.seo.description} />
            </head>
            <body>{children}</body>
        </html>
    )
}
```

### Client-side Hydration

```tsx
"use client"
// Client components get locale from useParams()
import { useParams } from "next/navigation"

export function ClientTranslatedComponent() {
    const { locale } = useParams<{ locale: iLocale }>()
    // Safe to use locale here - matches server
}
```

---

## Performance Optimization

### Dictionary Splitting

For large applications, consider dynamic imports:

```ts
// Advanced pattern: Lazy load large dictionaries
export const getDictionary = async (locale: iLocale) => {
    const dictionaries = await import(`./locales/${locale}.json`)
    return dictionaries.default
}
```

### Caching Strategy

```ts
// Cache dictionary instances
const dictionaryCache = new Map<iLocale, iDictionary>()

export function getDictionary(locale: iLocale): iDictionary {
    if (!dictionaryCache.has(locale)) {
        dictionaryCache.set(locale, dictionaries[locale] || dictionaries[DEFAULT_LOCALE])
    }
    return dictionaryCache.get(locale)!
}
```

---

## Testing Strategies

### Dictionary Testing

```ts
describe("Customer i18n", () => {
    it("has consistent keys across all locales", () => {
        const enKeys = Object.keys(getDictionary("en"))
        const deKeys = Object.keys(getDictionary("de"))
        expect(enKeys).toEqual(deKeys)
    })

    it("provides fallback for invalid locale", () => {
        const dictionary = getDictionary("invalid" as iLocale)
        expect(dictionary).toEqual(getDictionary("en"))
    })
})
```

### Component Testing with Locales

```tsx
import { render, screen } from "@testing-library/react"

// Mock useParams for consistent locale
jest.mock("next/navigation", () => ({
    useParams: () => ({ locale: "en" })
}))

test("renders translated content", () => {
    render(<CustomerActions />)
    expect(screen.getByText("Add Customer")).toBeInTheDocument()
})
```

---

## Troubleshooting

### Common Issues

| Problem                | Cause                          | Solution                                    |
| ---------------------- | ------------------------------ | ------------------------------------------- |
| Missing translations   | Key not defined in all locales | Add key to all dictionary objects           |
| FUT false positives    | Overly broad fuzzy matching    | Use `--strict` flag or add to `.fut.ignore` |
| Locale redirect loops  | Invalid cookie locale          | Clear `user-locale` cookie                  |
| Client/server mismatch | Different locale detection     | Ensure consistent locale resolution         |

### Debug Techniques

```ts
// Log dictionary access for debugging
export function getDictionary(locale: iLocale): iDictionary {
    console.log(`Dictionary requested for locale: ${locale}`)
    const dict = dictionaries[locale] || dictionaries[DEFAULT_LOCALE]
    if (!dictionaries[locale]) {
        console.warn(`Locale ${locale} not found, falling back to ${DEFAULT_LOCALE}`)
    }
    return dict
}
```

---

## Related Documentation

- [Routing & Navigation](./routing-navigation.md) - Locale-aware route building
- [Auth & Session Pattern](./auth-session-pattern.md) - Locale in auth redirects
- [Component Development](./react-component.md) - i18n in component structure
- [Locale Entity Documentation](../../Components/Entity/Locale/docs.md) - Detailed FUT tool usage

---

[← Back to README](../../README.md)
