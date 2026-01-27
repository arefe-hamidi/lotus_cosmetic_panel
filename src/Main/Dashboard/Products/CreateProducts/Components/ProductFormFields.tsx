"use client";

import type { iProductRequest } from "../../type";
import type { iCategory } from "../../../Category/type";
import type { iDictionary } from "../i18n";
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
import { ProductFormSearchableSelect } from "./ProductFormSearchableSelect";
import { ShortDescriptionField } from "./ShortDescriptionField";

interface iProductFormFieldsProps {
  formData: iProductRequest;
  setFormData: (data: iProductRequest) => void;
  categories: iCategory[] | undefined;
  dictionary: iDictionary;
  onAddShortDescription: () => void;
  onRemoveShortDescription: (index: number) => void;
  onUpdateShortDescription: (
    index: number,
    field: "value" | "description",
    value: string
  ) => void;
}

export function ProductFormFields({
  formData,
  setFormData,
  categories,
  dictionary,
  onAddShortDescription,
  onRemoveShortDescription,
  onUpdateShortDescription,
}: iProductFormFieldsProps) {
  return (
    <>
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
          <p className="text-xs text-destructive">Category is required</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      <ShortDescriptionField
        items={formData.short_description}
        onAdd={onAddShortDescription}
        onRemove={onRemoveShortDescription}
        onUpdate={onUpdateShortDescription}
        dictionary={dictionary}
      />
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
    </>
  );
}
