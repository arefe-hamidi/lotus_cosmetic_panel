"use client"

import { useState, useMemo } from "react"
import { Pencil, Trash2 } from "lucide-react"
import type { iCategory } from "../type"
import type { iDictionary } from "../i18n"
import Button from "@/Components/Shadcn/button"
import Badge from "@/Components/Shadcn/badge"
import { Tree, TreeNode } from "@/Components/Shadcn/tree"
import DeleteConfirmation from "@/Components/Entity/DeleteConfirmation/DeleteConfirmation"

interface iCategoryWithChildren extends iCategory {
  children?: iCategoryWithChildren[]
}

interface iProps {
  categories: iCategory[] | undefined
  isLoading: boolean
  onEdit: (category: iCategory) => void
  onDelete: (id: number) => void
  dictionary: iDictionary
}

function buildCategoryTree(categories: iCategory[]): iCategoryWithChildren[] {
  const categoryMap = new Map<number, iCategoryWithChildren>()
  const rootCategories: iCategoryWithChildren[] = []

  // First pass: create map of all categories
  categories.forEach((category) => {
    if (category.id) {
      categoryMap.set(category.id, { ...category, children: [] })
    }
  })

  // Second pass: build tree structure
  categories.forEach((category) => {
    if (!category.id) return

    const categoryWithChildren = categoryMap.get(category.id)
    if (!categoryWithChildren) return

    if (category.parent === null || category.parent === undefined) {
      // Root category
      rootCategories.push(categoryWithChildren)
    } else {
      // Child category
      const parent = categoryMap.get(category.parent)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(categoryWithChildren)
      } else {
        // Parent not found, treat as root
        rootCategories.push(categoryWithChildren)
      }
    }
  })

  // Sort categories by order
  const sortCategories = (cats: iCategoryWithChildren[]) => {
    cats.sort((a, b) => a.order - b.order)
    cats.forEach((cat) => {
      if (cat.children && cat.children.length > 0) {
        sortCategories(cat.children)
      }
    })
  }

  sortCategories(rootCategories)
  return rootCategories
}

interface iCategoryTreeNodeProps {
  category: iCategoryWithChildren
  onEdit: (category: iCategory) => void
  onDelete: (id: number) => void
  dictionary: iDictionary
}

function CategoryTreeNode({
  category,
  onEdit,
  onDelete,
  dictionary,
}: iCategoryTreeNodeProps) {
  const hasChildren = category.children && category.children.length > 0

  const label = (
    <div className="flex items-center gap-2 min-w-0 flex-1">
      {category.icon && (
        <i className={`${category.icon} text-muted-foreground shrink-0`} />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{category.name}</div>
        <div className="text-xs text-muted-foreground truncate">{category.slug}</div>
      </div>
      <Badge variant={category.is_active ? "default" : "secondary"} className="shrink-0">
        {category.is_active ? "Active" : "Inactive"}
      </Badge>
      <div className="text-xs text-muted-foreground shrink-0">#{category.order}</div>
    </div>
  )

  const actions = (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onEdit(category)}
      >
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive"
        onClick={() => category.id && onDelete(category.id)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  )

  return (
    <TreeNode
      id={category.id || `category-${category.slug}`}
      label={label}
      icon={category.icon ? <i className={category.icon} /> : undefined}
      actions={actions}
      defaultExpanded={true}
    >
      {hasChildren &&
        category.children!.map((child) => (
          <CategoryTreeNode
            key={child.id}
            category={child}
            onEdit={onEdit}
            onDelete={onDelete}
            dictionary={dictionary}
          />
        ))}
    </TreeNode>
  )
}

export default function CategoryTree({
  categories,
  isLoading,
  onEdit,
  onDelete,
  dictionary,
}: iProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<iCategory | null>(null)

  const handleDeleteClick = (id: number) => {
    const category = categories?.find((cat) => cat.id === id)
    if (category) {
      setCategoryToDelete(category)
      setDeleteDialogOpen(true)
    }
  }

  const handleConfirmDelete = () => {
    if (categoryToDelete?.id) {
      onDelete(categoryToDelete.id)
      setCategoryToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No categories found.
      </div>
    )
  }

  const treeData = useMemo(() => buildCategoryTree(categories || []), [categories])

  const defaultExpanded = useMemo(
    () =>
      treeData
        .map((cat) => (cat.id ? cat.id : `category-${cat.slug}`))
        .filter((id): id is string | number => Boolean(id)) as (string | number)[],
    [treeData]
  )

  return (
    <>
      <div className="border rounded-lg p-2">
        <Tree defaultExpanded={defaultExpanded}>
          {treeData.map((category) => (
            <CategoryTreeNode
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={handleDeleteClick}
              dictionary={dictionary}
            />
          ))}
        </Tree>
      </div>
      <DeleteConfirmation
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={dictionary.deleteCategory}
        description={dictionary.messages.deleteConfirm}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </>
  )
}
