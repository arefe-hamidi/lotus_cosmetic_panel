# Developing React components

The correct way to create and develop a React component in a project.

## 1) React and non-React files and directories

File names that define a React component should be written in PascalCase,.e.g:    
**Home.tsx, UserProfile.tsx, InvoiceHistory.tsx**

Also, in the project, the names of the directories containing React components should be in **PascalCase**, and the other directories should be in **camelCase**.

For example, the _Main, Components, Layout, Entity, and Partial_ directories are case sensitive due to this PascalCase and the directories _hook, lib, i18n, styles,_ etc. are written in camelCase..

&nbsp;

## 2) One file, one component

Only one React component should be defined in each file, even if the side component is simple and small, it should be defined in a separate file.

&nbsp;

## 3) Defining component properties with iProps

Above the component function, for all components that have props, it must be defined with the following interface pattern and no other names or definitions should be used.

```typescript
interface iProps {
    children: ReactNode
    params: string
}

export default function myCustomComponent({ children, params }: iProps) {
    //....
    return children
}
```

&nbsp;

## 4) Only the component should be defined in the file.

In the component file, only the component function must be defined and exported. We _do not have the right to define_ constants, utilities, etc. in addition to that, and each must be included in its corresponding fractal entity.

**Exception 1**: In some tools, it is necessary to define and export a number of other values ​​in addition to the component definition based on the mandatory pattern, such as exporting generateMetadata in NextJs routing files, which is the only case where this rule can be ignored.

**Exception 2**: In addition to the component, you can also define the interface properties of the component (iProps) in it, but you do not have the right to export them, in which case a common type must be defined and exported in the fractal entity types.

&nbsp;

## 5) Use "function declarations" and direct exports

"Function expressions" should not be used to define components, and all components should be defined with the "Function declarations" pattern and direct exports;

```typescript
⛔️
const wrongPattern = () => {
   //....
   return ""
}
export default wrongPattern

✅
export default function correctPattern() {
   //....
   return children
}
```

&nbsp;

## 6) NextJS routing components naming (Page, Layout)

The names of components defined in Next JS reserved files such as **page.tsx, error.tsx, layout.tsx and not-found.tsx** must be exactly the same as the file name itself in all cases.

NOTICE **loading.tsx**: Because the structure of loading components should be very simple and always be just one component without any side files, we define the content of loading.tsx exclusively in its own file.

It is important to note that although these components are exported, you do not have the right to import them elsewhere in the project.

```typescript
/**
 * for all route, .e.g:
 *   ~/app/dashboard/invoice/page.tsx
 *   ~/app/dashboard/page.tsx
 *   ~/app/page.tsx
 */

export default async function Page() {
  return ....
}
```

&nbsp;

&nbsp;

[< back](/README.md)
