"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Plus } from "lucide-react";
import { toast } from "sonner";
import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";
import { useCreateProduct } from "./api";
import { useGetCategories } from "../../Category/api";
import type { iProductRequest } from "../type";
import { parseErrorResponse } from "@/lib/api/utils/parseError";
import { appRoutes } from "@/lib/routes/appRoutes";

import Button from "@/Components/Shadcn/button";
import Input from "@/Components/Shadcn/input";
import Label from "@/Components/Shadcn/label";
import Textarea from "@/Components/Shadcn/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Shadcn/select";
import { ProductFormSearchableSelect } from "./Components/ProductFormSearchableSelect";

interface iProps {
  locale: iLocale;
}

export default function CreateProducts({ locale }: iProps) {
  const dictionary = getDictionary(locale);
  const router = useRouter();
  const { data: categories } = useGetCategories();
  const createMutation = useCreateProduct();

  const [formData, setFormData] = useState<iProductRequest>({
    name: "",
    description: "",
    short_description: [],
    category: 0,
    price: 0,
    stock_quantity: 0,
    is_active: true,
  });

  const addShortDescription = () => {
    setFormData({
      ...formData,
      short_description: [
        ...formData.short_description,
        { value: "", description: "" },
      ],
    });
  };

  const removeShortDescription = (index: number) => {
    setFormData({
      ...formData,
      short_description: formData.short_description.filter((_, i) => i !== index),
    });
  };

  const updateShortDescription = (
    index: number,
    field: "value" | "description",
    newValue: string
  ) => {
    const updated = [...formData.short_description];
    updated[index] = { ...updated[index], [field]: newValue };
    setFormData({
      ...formData,
      short_description: updated,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category === 0) {
      toast.error("Please select a category");
      return;
    }
    try {
      await createMutation.mutateAsync(formData);
      toast.success(dictionary.messages.success);
      router.push(appRoutes.dashboard.products.root(locale));
    } catch (error) {
      console.error("Failed to create product:", error);
      const errorMessage = await parseErrorResponse(
        error,
        dictionary.messages.error
      );
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(appRoutes.dashboard.products.root(locale))}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {dictionary.title}
            </h1>
            <p className="text-muted-foreground">{dictionary.description}</p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Label htmlFor="description">{dictionary.form.description}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{dictionary.form.shortDescription}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addShortDescription}
              >
                <Plus className="mr-2 h-4 w-4" />
                {dictionary.form.addShortDescription}
              </Button>
            </div>
            {formData.short_description.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 items-start p-3 border rounded-md"
              >
                <div className="flex-1 space-y-2">
                  <div>
                    <Label className="text-xs">
                      {dictionary.form.value}
                    </Label>
                    <Input
                      value={item.value}
                      onChange={(e) =>
                        updateShortDescription(index, "value", e.target.value)
                      }
                      placeholder={dictionary.form.value}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">
                      {dictionary.form.descriptionLabel}
                    </Label>
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        updateShortDescription(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder={dictionary.form.descriptionLabel}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeShortDescription(index)}
                  className="mt-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{dictionary.form.category}</Label>
            <ProductFormSearchableSelect
              value={formData.category || null}
              onChange={(categoryId) =>
                setFormData({
                  ...formData,
                  category: categoryId || 0,
                })
              }
              placeholder={dictionary.form.category}
              selectedCategory={
                categories?.find((c) => c.id === formData.category) || null
              }
            />
            {formData.category === 0 && (
              <p className="text-xs text-destructive">
                Category is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">{dictionary.form.price}</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock_quantity">
              {dictionary.form.stockQuantity}
            </Label>
            <Input
              id="stock_quantity"
              type="number"
              value={formData.stock_quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock_quantity: parseInt(e.target.value) || 0,
                })
              }
              required
              min="0"
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
              onClick={() => router.push(appRoutes.dashboard.products.root(locale))}
            >
              {dictionary.form.cancel}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {dictionary.form.submit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
