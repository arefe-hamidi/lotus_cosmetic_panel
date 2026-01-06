# Import and export rules

## 1) Access hierarchy

Lower levels have access to the capabilities of higher levels, but higher levels should not have access to the capabilities of lower levels.

For example, if we have a Sample.ts file, a utils file, and a directory called Inner in the Sample directory, such that there is both an Inner.ts file and an utils.ts file in the Inner directory, the Sample.ts file should not have any imports from Inner except the root Inner.ts file.

If we want to use utils, the Sample.ts file only has access to the utils in utils.ts in the root Sample directory, but the Inner.ts file has access to both the utils.ts in Inner and the utils.ts in the root Sample directory.

```typescript
├── /Sample                           
│   ├── Sample.tsx   # Only has access to '/Simple/utils.ts'
│   ├── utils.ts 
│   └── /Inner
│         ├── Inner.tsx  # accesses to '/Simple/Inner/utils.ts' and '/Simple/utils.ts'
│         └── utils.tsx
```

**Notice**: This rule is **not a mandatory** concept, **but you should try to follow** it as much as possible, and if you see something that does not follow this rule, _be sure to propose a correction in the team meetings_.

&nbsp;

## 2) Do not re-export with aliasing (map and mix exports)

Once an entity is defined in a file, it should not be re-exported for use in another file or made available in the project under a different name by re-exporting with aliasing.

This is a useful method in external packages, but in the project everything should be directly understandable and understandable, and this makes it more complicated and unclear where exactly the structure definition is in the import location and should be avoided.

```typescript
⛔️ it's wrong

export { getLoginUrl } from './utils/login-url'
export { AuthWrapper } from './wrappers/AuthWrapper'
export { default as LoginPage } from './pages/login'
export { useAuthStoreStates, useAuthStoreActions } from './store'
```

&nbsp;

## 3) Defining and using appRoutes

Because nextjs routing is file-based, we don't have an object that defines the routing, so we have to define the link address to the pages as a string directly, which creates two problems: first, the possibility of human error in this method is high and can cause invalid link bugs, and second, there is no reliable way to change a route whose path has changed and must be modified throughout the project.

To solve this problem, we use the appRoutes object located in lib/routes.ts and you need to change this file every time you make a change to the routing structure.

It is normal that after changing the structure of this file, errors will be generated in the project, which can be prevented by fixing them.

NOTICE: define routes pathnames without locale and if you need to add locale, use the utils available in **~/lib/i18n/utils.ts**.

```typescript
✅ in ~/lib/routes.ts

export const appRoutes = {
  signIn: "/signin",
  faq: (id?: number) => ("/faq" + id ? `/${id}` : ""),
  dashboard: {
    home: "/dashboard",
    reports: "/dashboard/reports",
    users: (id?: number) => ("/dashboard/users" + id ? `/${id}` : ""),
  }
}

❇️ Used in a Link component
import { appRoutes } from "@/lib/routes"
import Link from "next/link"

export function MyComponent() {
  return <Link href={appRoutes.dashboard.home}>dashboard</Link>
}

❇️ Used in a ~/lib/configs/auth.ts
...
const segments = pathname.split("/")
const topLevelValue = segments[2]
const topLevelPath = `/${segments[2]}`
const isOnDashboard = topLevelPath === appRoutes.dashboard.home
...

```

&nbsp;

&nbsp;

[< back](/README.md)
