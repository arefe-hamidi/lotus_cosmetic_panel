import { iBreakpoint } from "./types"

// Tailwind breakpoint pixel values (min-width) aligned with default Tailwind config
// Used to decide when to switch from mobile to desktop rendering using JS instead of CSS utility visibility classes.
export const BREAKPOINT_PIXELS: Record<iBreakpoint, number> = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
    "4xl": 1920
}
