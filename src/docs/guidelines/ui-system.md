# UI System & Theming

Comprehensive design system built on Shadcn primitives with theme switching, component extensions, and consistent design patterns.

---

## Overview

The UI system provides:

- **Shadcn Foundation**: Radix-based primitive components with Tailwind styling
- **Theme System**: Light/dark/system theme switching with SSR compatibility
- **Component Extensions**: Domain-specific components built on Shadcn primitives
- **Design Tokens**: Consistent spacing, colors, and typography via Tailwind
- **Responsive Patterns**: Mobile-first design with consistent breakpoints

---

## Architecture Components

### 1. Shadcn Primitives (`Components/Shadcn/`)

Core UI building blocks:

```
Components/Shadcn/
├── button.tsx          # Primary interactive element
├── card.tsx            # Content containers
├── dialog.tsx          # Modal interactions
├── input.tsx           # Form inputs
├── select.tsx          # Dropdown selections
├── table.tsx           # Data display
├── tabs.tsx            # Tab navigation
└── lib/utils.ts        # Shared utilities (cn function)
```

### 2. Theme System (`Components/Entity/Theme/`)

```
Components/Entity/Theme/
├── constants.ts                    # Theme constants and cookie names
├── stores.ts                      # Zustand theme state management
├── types.ts                       # Theme type definitions
├── utils.ts                       # SSR theme detection utilities
├── styles.css                     # Theme transition animations
└── Components/
    ├── ThemeInit.tsx              # Client-side theme initialization
    └── ThemeSwitcher/
        ├── ThemeSwitcher.tsx      # Theme toggle component
        └── ThemeSwitcherButton.tsx # Button variant
```

### 3. Extended Components (`Components/Common/`, `Components/Entity/`)

Domain-specific components built on Shadcn primitives:

```
Components/
├── Common/                # Reusable business components
│   ├── CustomersCard/     # Customer data display
│   ├── ObjectsCard/       # Object management UI
│   └── ServiceLogsCard/   # Service log presentation
├── Entity/                # Complex feature modules
│   ├── Facet/            # Search and filtering
│   ├── Map/              # Geographic visualization
│   └── ImageCropper/     # Image manipulation
└── Layout/               # Application shell components
    ├── AuthLayout/       # Authentication pages layout
    └── DashboardLayout/  # Main application layout
```

---

## Theme System Usage

### SSR Theme Integration

```tsx
// app/[locale]/layout.tsx
import { ThemeInit } from "@/Components/Entity/Theme/Components/ThemeInit"
import { getLayoutTheme } from "@/Components/Entity/Theme/utils"
import { cookies } from "next/headers"

export default async function RootLayout({ children }) {
    const cookieStore = await cookies()
    const theme = getLayoutTheme(cookieStore)

    return (
        <html className={theme}>
            <body>
                <ThemeInit />
                {children}
            </body>
        </html>
    )
}
```

### Theme Switching Components

```tsx
import { ThemeSwitcher } from "@/Components/Entity/Theme/Components/ThemeSwitcher/ThemeSwitcher"

// Default appearance (icon button)
<ThemeSwitcher />

// Custom styling
<ThemeSwitcher className="ml-4" />
```

### Programmatic Theme Access

```tsx
"use client"
import { useThemeStore } from "@/Components/Entity/Theme/stores"

export function ThemedComponent() {
    const { theme, setTheme } = useThemeStore()

    return (
        <div>
            <p>Current theme: {theme}</p>
            <button onClick={() => setTheme("dark")}>Switch to Dark</button>
        </div>
    )
}
```

---

## Shadcn Component Usage

### Basic Components

```tsx
import { Button } from "@/Components/Shadcn/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/Shadcn/card"
import { Input } from "@/Components/Shadcn/input"

export function BasicExample() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input placeholder="Customer name" />
                <Button>Save Customer</Button>
            </CardContent>
        </Card>
    )
}
```

### Form Components

```tsx
import { Label } from "@/Components/Shadcn/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/Components/Shadcn/select"
import { Textarea } from "@/Components/Shadcn/textarea"

export function FormExample() {
    return (
        <form className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="customer-type">Customer Type</Label>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional information" />
            </div>
        </form>
    )
}
```

### Data Display Components

```tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/Components/Shadcn/table"
import { Badge } from "@/Components/Shadcn/badge"

export function DataTable({ customers }: { customers: Customer[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {customers.map(customer => (
                    <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>
                            <Badge variant={customer.active ? "default" : "secondary"}>
                                {customer.active ? "Active" : "Inactive"}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Button variant="outline" size="sm">
                                Edit
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
```

---

## Component Extension Patterns

### Extending Shadcn Components

```tsx
// Extended Button with custom variants
import { Button, type ButtonProps } from "@/Components/Shadcn/button"
import { cn } from "@/Components/Shadcn/lib/utils"

interface ExtendedButtonProps extends ButtonProps {
    loading?: boolean
    icon?: React.ReactNode
}

export function ExtendedButton({
    loading = false,
    icon,
    children,
    className,
    disabled,
    ...props
}: ExtendedButtonProps) {
    return (
        <Button
            className={cn("flex items-center gap-2", className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
                icon
            )}
            {children}
        </Button>
    )
}
```

### Composite Components

```tsx
// Domain-specific card component
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/Shadcn/card"
import { Button } from "@/Components/Shadcn/button"
import { Badge } from "@/Components/Shadcn/badge"

interface CustomerCardProps {
    customer: Customer
    onEdit: (id: string) => void
    onView: (id: string) => void
}

export function CustomerCard({ customer, onEdit, onView }: CustomerCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{customer.name}</CardTitle>
                <Badge variant={customer.active ? "default" : "secondary"}>
                    {customer.active ? "Active" : "Inactive"}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="text-muted-foreground mb-4 text-xs">{customer.email}</div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onView(customer.id)}>
                        View
                    </Button>
                    <Button size="sm" onClick={() => onEdit(customer.id)}>
                        Edit
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
```

---

## Design Token System

### Color Palette

The theme system uses CSS custom properties for consistent theming:

```css
/* Light theme */
:root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
}

/* Dark theme */
.dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
}
```

### Using Design Tokens

```tsx
// Via Tailwind utilities (recommended)
<div className="bg-background text-foreground border-border">
    <h1 className="text-primary">Primary Text</h1>
    <p className="text-muted-foreground">Secondary Text</p>
</div>

// Via CSS custom properties (when needed)
<div style={{ backgroundColor: "hsl(var(--background))" }}>
    Custom styling
</div>
```

### Typography Scale

```tsx
// Consistent text sizing
<h1 className="text-4xl font-bold">Main Heading</h1>
<h2 className="text-3xl font-semibold">Section Heading</h2>
<h3 className="text-xl font-medium">Subsection</h3>
<p className="text-base">Body text</p>
<span className="text-sm text-muted-foreground">Helper text</span>
```

---

## Responsive Design Patterns

### Breakpoint System

```tsx
// Tailwind responsive utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Responsive grid */}
</div>

<aside className="hidden lg:block">
    {/* Desktop-only sidebar */}
</aside>

<Button className="w-full sm:w-auto">
    {/* Full width on mobile, auto on desktop */}
</Button>
```

### Mobile-first Components

```tsx
import { Sheet, SheetContent, SheetTrigger } from "@/Components/Shadcn/sheet"
import { Dialog, DialogContent, DialogTrigger } from "@/Components/Shadcn/dialog"
import { useMediaQuery } from "@/lib/hooks/useMediaQuery"

export function ResponsiveModal({ children, trigger }: ResponsiveModalProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent>{children}</DialogContent>
            </Dialog>
        )
    }

    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent>{children}</SheetContent>
        </Sheet>
    )
}
```

---

## Animation & Transitions

### Theme Transitions

```css
/* Components/Entity/Theme/styles.css */
.invisible-until-the-theme-is-set {
    visibility: hidden;
}

html {
    transition:
        background-color 0.3s ease,
        color 0.3s ease;
}

* {
    transition:
        border-color 0.3s ease,
        background-color 0.3s ease;
}
```

### Component Animations

```tsx
import { cn } from "@/Components/Shadcn/lib/utils"

interface AnimatedCardProps {
    isVisible: boolean
    children: React.ReactNode
}

export function AnimatedCard({ isVisible, children }: AnimatedCardProps) {
    return (
        <Card
            className={cn(
                "transition-all duration-300 ease-in-out",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
        >
            {children}
        </Card>
    )
}
```

---

## Accessibility Considerations

### Focus Management

```tsx
import { Dialog, DialogContent, DialogTitle } from "@/Components/Shadcn/dialog"

export function AccessibleModal() {
    return (
        <Dialog>
            <DialogContent>
                {/* DialogTitle is required for screen readers */}
                <DialogTitle>Customer Details</DialogTitle>
                <form>
                    {/* Focus trapped within modal */}
                    <Input autoFocus placeholder="Customer name" />
                </form>
            </DialogContent>
        </Dialog>
    )
}
```

### Semantic HTML

```tsx
export function AccessibleDataTable() {
    return (
        <Table>
            <caption className="sr-only">List of customers with their status and actions</caption>
            <TableHeader>
                <TableRow>
                    <TableHead scope="col">Name</TableHead>
                    <TableHead scope="col">Status</TableHead>
                    <TableHead scope="col">Actions</TableHead>
                </TableRow>
            </TableHeader>
            {/* ... table body */}
        </Table>
    )
}
```

### ARIA Labels

```tsx
import { Button } from "@/Components/Shadcn/button"

export function IconButton({ icon, label, onClick }: IconButtonProps) {
    return (
        <Button variant="ghost" size="icon" onClick={onClick} aria-label={label}>
            {icon}
            <span className="sr-only">{label}</span>
        </Button>
    )
}
```

---

## Performance Optimization

### Component Lazy Loading

```tsx
import { lazy, Suspense } from "react"
import { Skeleton } from "@/Components/Shadcn/skeleton"

const HeavyChart = lazy(() => import("./HeavyChart"))

export function DashboardWithChart() {
    return (
        <div>
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                <HeavyChart />
            </Suspense>
        </div>
    )
}
```

### Optimized Re-renders

```tsx
import { memo } from "react"
import { Card } from "@/Components/Shadcn/card"

interface CustomerCardProps {
    customer: Customer
    onEdit: (id: string) => void
}

export const CustomerCard = memo(
    function CustomerCard({ customer, onEdit }: CustomerCardProps) {
        return <Card>{/* Component content */}</Card>
    },
    (prevProps, nextProps) => {
        // Custom comparison for optimization
        return (
            prevProps.customer.id === nextProps.customer.id &&
            prevProps.customer.updatedAt === nextProps.customer.updatedAt
        )
    }
)
```

---

## Testing Strategies

### Component Testing

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeProvider } from "@/Components/Entity/Theme/Components/ThemeProvider"

function renderWithTheme(component: React.ReactElement) {
    return render(<ThemeProvider>{component}</ThemeProvider>)
}

test("theme switcher changes theme", async () => {
    const user = userEvent.setup()
    renderWithTheme(<ThemeSwitcher />)

    const button = screen.getByRole("button", { name: /toggle theme/i })
    await user.click(button)

    // Assert theme change
})
```

### Visual Regression Testing

```tsx
// Storybook stories for component variants
export default {
    title: "UI/CustomerCard",
    component: CustomerCard,
    parameters: {
        backgrounds: {
            values: [
                { name: "light", value: "#ffffff" },
                { name: "dark", value: "#0f0f23" }
            ]
        }
    }
}

export const Default = {
    args: {
        customer: mockCustomer
    }
}

export const Inactive = {
    args: {
        customer: { ...mockCustomer, active: false }
    }
}
```

---

## Customization Guide

### Adding New Shadcn Components

```bash
# Install new Shadcn component
npx shadcn-ui@latest add tooltip

# Component will be added to Components/Shadcn/tooltip.tsx
```

### Custom Component Variants

```tsx
// Extend existing component with new variants
import { Button, buttonVariants } from "@/Components/Shadcn/button"
import { cva } from "class-variance-authority"

const customButtonVariants = cva(
    buttonVariants.base, // Inherit base styles
    {
        variants: {
            ...buttonVariants.variants, // Inherit existing variants
            intent: {
                success: "bg-green-600 hover:bg-green-700",
                warning: "bg-yellow-600 hover:bg-yellow-700",
                danger: "bg-red-600 hover:bg-red-700"
            }
        }
    }
)

export function CustomButton(props: CustomButtonProps) {
    // Implementation with new variants
}
```

---

## Troubleshooting

### Common Issues

| Problem                     | Cause                  | Solution                             |
| --------------------------- | ---------------------- | ------------------------------------ |
| Theme flashing on load      | SSR/CSR theme mismatch | Ensure ThemeInit runs early          |
| Component styling conflicts | CSS specificity issues | Use cn() utility for class merging   |
| Dark mode colors broken     | Missing CSS variables  | Check theme CSS custom properties    |
| Responsive layout issues    | Incorrect breakpoints  | Review Tailwind responsive utilities |

### Debug Techniques

```tsx
// Theme debugging component
export function ThemeDebug() {
    const { theme } = useThemeStore()

    return (
        <div className="bg-background fixed right-4 bottom-4 rounded border p-2">
            <div>Current theme: {theme}</div>
            <div>
                System prefers:{" "}
                {window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"}
            </div>
        </div>
    )
}
```

---

## Related Documentation

- [React Component Guidelines](./react-component.md) - Component structure and organization
- [Theme System Details](../../Components/Entity/Theme/docs.md) - Detailed theme implementation
- [Fractal Modular Pattern](./fractal-modular-pattern.md) - Component organization strategy
- [TypeScript Conventions](./typescript.md) - Component typing patterns

---

[← Back to README](../../README.md)
