"use client"

import { useState, useMemo } from "react"
import type { iCategory } from "../../type"
import type { iCategoryTreeProps } from "./types"
import { Tree } from "@/Components/Shadcn/tree"
import DeleteConfirmation from "@/Components/Entity/DeleteConfirmation/DeleteConfirmation"
import { CategoryTreeNode } from "./CategoryTreeNode"
import { buildCategoryTree } from "./utils"

export default function CategoryTree({
  categories,
  isLoading,
  onEdit,
  onDelete,
  onAddChild,
  dictionary,
}: iCategoryTreeProps) {
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
        .map((cat) => (cat.id ? cat.id : `category-${cat.name}`))
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
              onAddChild={onAddChild}
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
