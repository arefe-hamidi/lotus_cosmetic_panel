import type { iCategory } from "../../type"
import type { iCategoryWithChildren } from "./types"

export function buildCategoryTree(categories: iCategory[]): iCategoryWithChildren[] {
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
