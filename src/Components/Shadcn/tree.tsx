"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "./lib/utils"

const TREE_INDENT_REM = 1.5
const ROW_HEIGHT_REM = 2.5

interface TreeContextValue {
  level: number
  expanded: Set<string | number>
  onToggle: (id: string | number) => void
  showLines: boolean
}

const TreeContext = React.createContext<TreeContextValue | undefined>(undefined)

function useTreeContext() {
  const context = React.useContext(TreeContext)
  if (!context) {
    throw new Error("Tree components must be used within a Tree")
  }
  return context
}

export interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultExpanded?: (string | number)[]
  onExpandedChange?: (expanded: (string | number)[]) => void
  /** When true, draws vertical and horizontal connector lines between parent and children */
  showLines?: boolean
}

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    { className, defaultExpanded = [], onExpandedChange, showLines = false, children, ...props },
    ref
  ) => {
    // Use function initializer to ensure consistent initialization on server and client
    const [expanded, setExpanded] = React.useState<Set<string | number>>(
      () => new Set(defaultExpanded)
    )

    const handleToggle = React.useCallback(
      (id: string | number) => {
        setExpanded((prev) => {
          const next = new Set(prev)
          if (next.has(id)) {
            next.delete(id)
          } else {
            next.add(id)
          }
          onExpandedChange?.(Array.from(next))
          return next
        })
      },
      [onExpandedChange]
    )

    const contextValue = React.useMemo<TreeContextValue>(
      () => ({
        level: 0,
        expanded,
        onToggle: handleToggle,
        showLines,
      }),
      [expanded, handleToggle, showLines]
    )

    return (
      <TreeContext.Provider value={contextValue}>
        <div ref={ref} className={cn("space-y-1", className)} {...props}>
          {children}
        </div>
      </TreeContext.Provider>
    )
  }
)
Tree.displayName = "Tree"

export interface TreeNodeProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "id" | "children"
> {
  id: string | number
  label: React.ReactNode
  children?: React.ReactNode
  defaultExpanded?: boolean
  icon?: React.ReactNode
  actions?: React.ReactNode
  /** When true, the vertical connector line does not extend below this row (for last sibling) */
  isLast?: boolean
}

const TreeNode = React.forwardRef<HTMLDivElement, TreeNodeProps>(
  (
    {
      className,
      id,
      label,
      children,
      defaultExpanded = false,
      icon,
      actions,
      isLast = false,
      ...props
    },
    ref
  ) => {
    const { level, expanded, onToggle, showLines } = useTreeContext()
    const hasChildren = React.Children.count(children) > 0
    const isExpanded = expanded.has(id) ?? defaultExpanded
    const childLevel = level + 1
    const childContextValue = React.useMemo<TreeContextValue>(
      () => ({
        level: childLevel,
        expanded,
        onToggle,
        showLines,
      }),
      [childLevel, expanded, onToggle, showLines]
    )

    const rowPaddingLeft = showLines ? (level > 0 ? 1 : 0.5) : level * 1.5 + 0.5

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={showLines && level > 0 ? { marginLeft: `${TREE_INDENT_REM}rem` } : undefined}
        {...props}
      >
        <div
          className={cn(
            "hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
            !showLines && level > 0 && "ml-4"
          )}
          style={{ paddingLeft: `${rowPaddingLeft}rem` }}
        >
          {showLines && level > 0 && (
            <>
              <div
                className="border-muted-foreground/30 pointer-events-none absolute"
                style={{
                  left: 0,
                  top: `${ROW_HEIGHT_REM / 2}rem`,
                  width: "1rem",
                  borderBottomWidth: "1px",
                }}
                aria-hidden
              />

              <div
                className="border-muted-foreground/30 pointer-events-none absolute border-l"
                style={{
                  left: 0,
                  top: `${ROW_HEIGHT_REM / 2}rem`,
                  bottom: isLast ? `${ROW_HEIGHT_REM / 2}rem` : 0,
                }}
                aria-hidden
              />
            </>
          )}
          {hasChildren && isExpanded && showLines && (
            <div
              className="border-muted-foreground/30 pointer-events-none absolute border-l"
              style={{
                left: `${TREE_INDENT_REM}rem`,
                top: `${ROW_HEIGHT_REM / 2}rem`,
                bottom: 0,
              }}
              aria-hidden
            />
          )}
          {hasChildren ? (
            <button
              type="button"
              onClick={() => onToggle(id)}
              className="hover:bg-accent relative z-10 shrink-0 rounded p-0.5"
            >
              <ChevronRight
                className={cn(
                  "text-muted-foreground h-4 w-4 transition-transform",
                  isExpanded && "rotate-90 transform"
                )}
              />
            </button>
          ) : (
            <div className="w-5 shrink-0" />
          )}

          {icon && <div className="shrink-0">{icon}</div>}

          <div className="min-w-0 flex-1">{label}</div>

          {actions && <div className="shrink-0">{actions}</div>}
        </div>

        {hasChildren && isExpanded && (
          <TreeContext.Provider value={childContextValue}>
            <div className={showLines ? "" : "ml-4"}>{children}</div>
          </TreeContext.Provider>
        )}
      </div>
    )
  }
)
TreeNode.displayName = "TreeNode"

export { Tree, TreeNode }
