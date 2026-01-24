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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Shadcn/select";

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
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side={locale === "fa" ? "left" : "right"}>
        <SheetHeader>
          <SheetTitle>
            {editingCategory ? dictionary.editCategory : dictionary.addCategory}
          </SheetTitle>
          <SheetDescription>{dictionary.description}</SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
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
            <Label htmlFor="slug">{dictionary.form.slug}</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent">{dictionary.form.parent}</Label>
            <Select
              value={formData.parent?.toString() || "none"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  parent: value === "none" ? null : parseInt(value),
                })
              }
            >
              <SelectTrigger id="parent">
                <SelectValue placeholder={dictionary.form.parent} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {categories
                  ?.filter((c) => c.id !== editingCategory?.id)
                  .map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id?.toString() || ""}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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
          <div className="space-y-2">
            <Label htmlFor="is_active">{dictionary.form.isActive}</Label>
            <Select
              value={formData.is_active.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, is_active: value === "true" })
              }
            >
              <SelectTrigger id="is_active">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
