"use client";

import { useState } from "react";
import { Plus, List, Network } from "lucide-react";
import { toast } from "sonner";
import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";
import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "./api";
import type { iCategory, iCategoryRequest } from "./type";

import Button from "@/Components/Shadcn/button";
import CategoryTable from "./Components/CategoryTable";
import CategoryTree from "./Components/CategoryTree";
import CategorySheet from "./Components/CategoryForm";

interface iProps {
  locale: iLocale;
}

export default function Category({ locale }: iProps) {
  const dictionary = getDictionary(locale);
  const { data: categories, isLoading } = useGetCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [viewMode, setViewMode] = useState<"table" | "tree">("table");
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<iCategory | null>(
    null
  );

  const [formData, setFormData] = useState<iCategoryRequest>({
    name: "",
    slug: "",
    parent: null,
    icon: null,
    order: 1,
    is_active: true,
  });

  const handleOpenSheet = (category?: iCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        parent: category.parent,
        icon: category.icon,
        order: category.order,
        is_active: category.is_active,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        parent: null,
        icon: null,
        order: 1,
        is_active: true,
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory?.id) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      toast.success(dictionary.messages.success);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save category:", error);
      toast.error(dictionary.messages.error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(dictionary.messages.deleted);
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error(dictionary.messages.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {dictionary.title}
          </h1>
          <p className="text-muted-foreground">{dictionary.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === "tree" ? "default" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode("tree")}
              title="Tree View"
            >
              <Network className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => handleOpenSheet()}>
            <Plus className="mr-2 h-4 w-4" />
            {dictionary.addCategory}
          </Button>
        </div>
      </div>

      <CategorySheet
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editingCategory={editingCategory}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        dictionary={dictionary}
        locale={locale}
        categories={categories}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {viewMode === "tree" ? (
        <CategoryTree
          categories={categories}
          isLoading={isLoading}
          onEdit={handleOpenSheet}
          onDelete={handleDelete}
          dictionary={dictionary}
        />
      ) : (
        <CategoryTable
          categories={categories}
          isLoading={isLoading}
          onEdit={handleOpenSheet}
          onDelete={handleDelete}
          dictionary={dictionary}
        />
      )}
    </div>
  );
}
