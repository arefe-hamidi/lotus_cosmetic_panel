"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { iCategory } from "../type";
import type { iDictionary } from "../i18n";
import Button from "@/Components/Shadcn/button";
import Badge from "@/Components/Shadcn/badge";
import ResponsiveTable from "@/Components/Entity/ResponsiveTable/ResponsiveTable";
import type { iResponsiveColumn } from "@/Components/Entity/ResponsiveTable/types";
import DeleteConfirmation from "@/Components/Entity/DeleteConfirmation/DeleteConfirmation";

interface iProps {
  categories: iCategory[] | undefined;
  isLoading: boolean;
  onEdit: (category: iCategory) => void;
  onDelete: (id: number) => void;
  dictionary: iDictionary;
}

export default function CategoryTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
  dictionary,
}: iProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<iCategory | null>(
    null
  );

  const handleDeleteClick = (category: iCategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete?.id) {
      onDelete(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  const columns: iResponsiveColumn<iCategory>[] = [
    {
      label: dictionary.table.name,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.icon && <i className={`${row.icon} text-muted-foreground`} />}
          <div>
            <div>{row.name}</div>
            <div className="text-xs text-muted-foreground md:hidden">
              {row.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: dictionary.table.slug,
      isMobile: false, // Only on desktop
      cell: ({ row }) => row.slug,
    },
    {
      label: dictionary.table.order,
      isMobile: false, // Only on desktop
      cell: ({ row }) => row.order,
    },
    {
      label: dictionary.table.status,
      cell: ({ row }) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      label: dictionary.table.actions,
      labelClassName: "text-right",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(row)}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(row)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ResponsiveTable
        data={categories || []}
        columns={columns}
        breakpoint="md"
        isFetching={isLoading}
        emptyMessage="No categories found."
      />
      <DeleteConfirmation
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={dictionary.deleteCategory}
        description={dictionary.messages.deleteConfirm}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </>
  );
}
