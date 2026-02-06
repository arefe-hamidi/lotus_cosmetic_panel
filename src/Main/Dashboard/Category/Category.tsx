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
import { parseErrorResponse } from "@/lib/api/utils/parseError";

import Button from "@/Components/Shadcn/button";
import CategoryTree from "./Components/CategoryTree/CategoryTree";
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
  const [lockedParent, setLockedParent] = useState<number | null | undefined>(
    undefined
  );

  const [formData, setFormData] = useState<iCategoryRequest>({
    name: "",
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
        parent: category.parent,
        icon: category.icon,
        order: category.order,
        is_active: category.is_active,
      });
      setLockedParent(undefined);
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        parent: null,
        icon: null,
        order: 1,
        is_active: true,
      });
      setLockedParent(undefined);
    }
    setIsOpen(true);
  };

  const handleAddChild = (parentCategory: iCategory) => {
    setEditingCategory(null);
    setFormData({
      name: "",
      parent: parentCategory.id || null,
      icon: null,
      order: 1,
      is_active: true,
    });
    setLockedParent(parentCategory.id || null);
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
      setLockedParent(undefined);
    } catch (error) {
      console.error("Failed to save category:", error);
      const errorMessage = await parseErrorResponse(
        error,
        dictionary.messages.error
      );
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(dictionary.messages.deleted);
    } catch (error) {
      console.error("Failed to delete category:", error);
      const errorMessage = await parseErrorResponse(
        error,
        dictionary.messages.error
      );
      toast.error(errorMessage);
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
          <Button onClick={() => handleOpenSheet()}>
            <Plus className="mr-2 h-4 w-4" />
            {dictionary.addCategory}
          </Button>
        </div>
      </div>

      <CategorySheet
        isOpen={isOpen}
        setIsOpen={(open) => {
          setIsOpen(open);
          if (!open) setLockedParent(undefined);
        }}
        editingCategory={editingCategory}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        dictionary={dictionary}
        locale={locale}
        categories={categories}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

    
       { categories && categories.length > 0 ? <CategoryTree
          categories={categories}
          isLoading={isLoading}
          onEdit={handleOpenSheet}
          onDelete={handleDelete}
          onAddChild={handleAddChild}
          dictionary={dictionary}
        />:
        <div className="text-center py-8 text-muted-foreground">
       {dictionary.messages.noCategories}
        </div>
        }
 
    </div>
  );
}
