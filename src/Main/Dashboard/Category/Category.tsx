"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

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
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(dictionary.messages.deleteConfirm)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
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
        <Button onClick={() => handleOpenSheet()}>
          <Plus className="mr-2 h-4 w-4" />
          {dictionary.addCategory}
        </Button>
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

      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        onEdit={handleOpenSheet}
        onDelete={handleDelete}
        dictionary={dictionary}
      />
    </div>
  );
}
