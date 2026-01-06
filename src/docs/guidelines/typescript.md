# Typescript rules

## 1) Definition only in fractal entity types

No data types, except for the following exceptions, should be defined anywhere other than the fractal entity types, and they must be defined either in **types.ts** files or in separate ts files in the **/types** directory.

**Exceptions:**

1. Types that are restricted by an external tool in how they are named and inserted.

2. The type of component properties that should be included with the name **iProps** above the React component definition ([React Component Development Rules](react-component.md)).

3. The i18n dictionary types that are always exported from i18n.ts files along with getDictionart().

## 2) Naming types

Regardless of the definition type (type, interface, etc.), the names of type entities in the project must be defined with the specified pattern.

In this pattern, the letter i is first in lowercase and then the entity name is inserted in PascalCase, .e.g:

iLocale, iDictionary, iDictionaries, iGetDictionary

```typescript
import { locales } from "./utils"

export type iLocale = (typeof locales)[number]

export type iDictionary = {
    [key: string]: string | iDictionary
}
export type iDictionaries<T extends iDictionary> = {
    [L in iLocale]: T
}

export type iGetDictionary<T> = (locale: string) => T

export type iRemovedLocale = {
    locale: string
    purePath: string
    isValid: boolean
}
```

&nbsp;

&nbsp;

[< back](/README.md)
