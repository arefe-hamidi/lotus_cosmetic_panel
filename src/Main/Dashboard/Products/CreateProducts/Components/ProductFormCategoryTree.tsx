"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import type { iCategory } from "../../../Category/type";
import type { iCategoryWithChildren } from "../../../Category/Components/CategoryTree/types";
import { buildCategoryTree } from "../../../Category/Components/CategoryTree/utils";
import { Tree, TreeNode } from "@/Components/Shadcn/tree";
import { cn } from "@/Components/Shadcn/lib/utils";

interface iProductFormCategoryTreeProps {
  categories: iCategory[] | undefined;
  value: number | null;
  onChange: (categoryId: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

function SelectableCategoryNode({
  category,
  selectedId,
  onSelect,
}: {
  category: iCategoryWithChildren;
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = category.id != null && category.id === selectedId;

  const label = (
    <button
      type="button"
      onClick={() => category.id != null && onSelect(category.id)}
      className={cn(
        "flex w-full items-center gap-2 min-w-0 flex-1 text-left rounded-sm py-1 px-1 -mx-1 transition-colors",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none",
        isSelected && "bg-accent text-accent-foreground",
        !category.is_active && "opacity-50"
      )}
    >
      {isSelected && <Check className="h-4 w-4 shrink-0" />}
      {!isSelected && <span className="w-4 shrink-0" />}
      {category.icon && (
        <i className={cn(category.icon, "shrink-0", category.is_active ? "text-muted-foreground" : "text-muted-foreground/50")} />
      )}
      <span className="truncate font-medium">{category.name}</span>
    </button>
  );

  return (
    <TreeNode
      id={category.id ?? `category-${category.name}`}
      label={label}
      icon={undefined}
      defaultExpanded={true}
    >
      {hasChildren &&
        category.children!.map((child) => (
          <SelectableCategoryNode
            key={child.id ?? child.name}
            category={child}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
    </TreeNode>
  );
}

export function ProductFormCategoryTree({
  categories,
  value,
  onChange,
  placeholder = "Select a category",
  disabled,
}: iProductFormCategoryTreeProps) {
  const treeData = useMemo(
    () => (categories?.length ? buildCategoryTree(categories) : []),
    [categories]
  );

  const defaultExpanded = useMemo(
    () =>
      treeData
        .map((cat) => (cat.id != null ? cat.id : `category-${cat.name}`))
        .filter((id): id is string | number => Boolean(id)),
    [treeData]
  );

  if (!categories?.length) {
    return (
      <div className="rounded-md border border-input bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground">
        {placeholder}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-popover overflow-auto max-h-60 min-h-32",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div className="p-2">
        <Tree defaultExpanded={defaultExpanded}>
          {treeData.map((category) => (
            <SelectableCategoryNode
              key={category.id ?? category.name}
              category={category}
              selectedId={value}
              onSelect={(id) => onChange(id)}
            />
          ))}
        </Tree>
      </div>
    </div>
  );
}
