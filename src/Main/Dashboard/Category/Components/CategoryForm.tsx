"use client";

import type { iLocale } from "@/Components/Entity/Locale/types";
import type { iCategory, iCategoryRequest } from "../type";
import type { iDictionary } from "../i18n";

import Button from "@/Components/Shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/Components/Shadcn/sheet";
import Input from "@/Components/Shadcn/input";
import Label from "@/Components/Shadcn/label";
import { Switch } from "@/Components/Shadcn/switch";

interface iProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingCategory: iCategory | null;
  formData: iCategoryRequest;
  setFormData: (data: iCategoryRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  dictionary: iDictionary;
  locale: iLocale;
  categories: iCategory[] | undefined;
  isPending: boolean;
}

function getSheetTitle(
  editingCategory: iCategory | null,
  parentId: number | null,
  dictionary: iDictionary
): string {
  if (editingCategory) return dictionary.editCategory;
  if (parentId != null) return dictionary.addSubcategory;
  return dictionary.addParentCategory;
}

export default function CategoryForm({
  isOpen,
  setIsOpen,
  editingCategory,
  formData,
  setFormData,
  onSubmit,
  dictionary,
  locale,
  categories,
  isPending,
}: iProps) {
  const parentCategory =
    formData.parent != null
      ? categories?.find((c) => c.id === formData.parent)
      : null
  const showParentField = !editingCategory && formData.parent != null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side={locale === "fa" ? "left" : "right"}>
        <SheetHeader>
          <SheetTitle>
            {getSheetTitle(editingCategory, formData.parent, dictionary)}
          </SheetTitle>
          <SheetDescription>{dictionary.description}</SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          {showParentField && (
            <div className="space-y-2">
              <Label>{dictionary.form.parent}</Label>
              <Input
                readOnly
                value={parentCategory?.name ?? ""}
                className="bg-muted cursor-default"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">{dictionary.form.name}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">{dictionary.form.icon}</Label>
            <Input
              id="icon"
              value={formData.icon || ""}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">{dictionary.form.order}</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="flex items-center justify-between space-y-0 gap-2">
            <Label htmlFor="is_active" className="flex-1">
              {dictionary.form.isActive}
            </Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              {dictionary.form.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {dictionary.form.submit}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
