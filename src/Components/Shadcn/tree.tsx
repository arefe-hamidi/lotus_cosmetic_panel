"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "./lib/utils"

interface TreeContextValue {
  level: number
  expanded: Set<string | number>
  onToggle: (id: string | number) => void
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
}

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  ({ className, defaultExpanded = [], onExpandedChange, children, ...props }, ref) => {
    // Use function initializer to ensure consistent initialization on server and client
    // This prevents hydration mismatches by ensuring the same initial state on both
    const [expanded, setExpanded] = React.useState<Set<string | number>>(() => 
      new Set(defaultExpanded)
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
      }),
      [expanded, handleToggle]
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

export interface TreeNodeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "children"> {
  id: string | number
  label: React.ReactNode
  children?: React.ReactNode
  defaultExpanded?: boolean
  icon?: React.ReactNode
  actions?: React.ReactNode
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
      ...props
    },
    ref
  ) => {
    const { level, expanded, onToggle } = useTreeContext()
    const hasChildren = React.Children.count(children) > 0
    const isExpanded = expanded.has(id) ?? defaultExpanded

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
            level > 0 && "ml-4"
          )}
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={() => onToggle(id)}
              className="p-0.5 hover:bg-accent rounded shrink-0"
            >
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isExpanded && "transform rotate-90"
                )}
              />
            </button>
          ) : (
            <div className="w-5 shrink-0" />
          )}

          {icon && <div className="shrink-0">{icon}</div>}

          <div className="flex-1 min-w-0">{label}</div>

          {actions && <div className="shrink-0">{actions}</div>}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4">{children}</div>
        )}
      </div>
    )
  }
)
TreeNode.displayName = "TreeNode"

export { Tree, TreeNode }
