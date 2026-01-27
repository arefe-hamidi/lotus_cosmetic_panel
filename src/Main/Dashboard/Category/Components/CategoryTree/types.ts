import type { iCategory } from "../../type"
import type { iDictionary } from "../../i18n"

export interface iCategoryWithChildren extends iCategory {
  children?: iCategoryWithChildren[]
}

export interface iCategoryTreeProps {
  categories: iCategory[] | undefined
  isLoading: boolean
  onEdit: (category: iCategory) => void
  onDelete: (id: number) => void
  onAddChild: (parentCategory: iCategory) => void
  dictionary: iDictionary
}

export interface iCategoryTreeNodeProps {
  category: iCategoryWithChildren
  onEdit: (category: iCategory) => void
  onDelete: (id: number) => void
  onAddChild: (parentCategory: iCategory) => void
  dictionary: iDictionary
}
