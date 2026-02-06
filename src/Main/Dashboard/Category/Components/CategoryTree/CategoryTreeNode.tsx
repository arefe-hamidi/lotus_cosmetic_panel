"use client"

import { Pencil, Trash2, Plus } from "lucide-react"
import type { iCategoryTreeNodeProps } from "./types"
import Button from "@/Components/Shadcn/button"
import { TreeNode } from "@/Components/Shadcn/tree"
import { cn } from "@/Components/Shadcn/lib/utils"

export function CategoryTreeNode({
  category,
  onEdit,
  onDelete,
  onAddChild,
  dictionary,
  isLast = false,
}: iCategoryTreeNodeProps) {
  const hasChildren = category.children && category.children.length > 0

  const label = (
    <div
      className={cn("flex min-w-0 flex-1 items-center gap-2", !category.is_active && "opacity-50")}
    >
      {category.icon && (
        <i
          className={cn(
            `${category.icon} shrink-0`,
            category.is_active ? "text-muted-foreground" : "text-muted-foreground/50"
          )}
        />
      )}
      <div className="flex min-w-0 flex-col gap-0.5">
        <div
          className={cn(
            "truncate",
            category.is_active ? "font-medium" : "text-muted-foreground font-normal"
          )}
        >
          {category.name}
        </div>
      </div>
      <div className="text-muted-foreground shrink-0 text-xs">#{category.order}</div>
    </div>
  )

  const actions = (
    <div className="flex items-center gap-1">
      {!hasChildren && (
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive h-8 w-8"
          onClick={() => category.id && onDelete(category.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="text-primary h-8 w-8"
        onClick={() => onAddChild(category)}
        title="Add child category"
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add child</span>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(category)}>
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
    </div>
  )

  return (
    <TreeNode
      id={category.id || `category-${category.name}`}
      label={label}
      icon={category.icon ? <i className={category.icon} /> : undefined}
      actions={actions}
      defaultExpanded={false}
      isLast={isLast}
    >
      {hasChildren
        ? category.children!.map((child, index) => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              dictionary={dictionary}
              isLast={index === category.children!.length - 1}
            />
          ))
        : null}
    </TreeNode>
  )
}
