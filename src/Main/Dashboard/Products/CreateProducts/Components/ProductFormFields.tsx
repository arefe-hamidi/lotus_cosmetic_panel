"use client"

import type { iProductImage, iProductFormState } from "../../type"
import type { iCategory } from "../../../Category/type"
import type { iDictionary } from "../i18n"
import Input from "@/Components/Shadcn/input"
import Label from "@/Components/Shadcn/label"
import Textarea from "@/Components/Shadcn/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Shadcn/select"
import { ProductFormCategoryTree } from "./ProductFormCategoryTree"
import { ProductFormImages } from "./ProductFormImages"
import { ShortDescriptionField } from "./ShortDescriptionField"

interface iProductFormFieldsProps {
  formData: iProductFormState
  setFormData: (data: iProductFormState) => void
  categories: iCategory[] | undefined
  dictionary: iDictionary
  onAddShortDescription: () => void
  onRemoveShortDescription: (index: number) => void
  onUpdateShortDescription: (index: number, field: "value" | "description", value: string) => void
  onAddImage: () => void
  onRemoveImage: (index: number) => void
  onUpdateImage: (index: number, field: keyof iProductImage, value: string | boolean | number | "") => void
}

export function ProductFormFields({
  formData,
  setFormData,
  categories,
  dictionary,
  onAddShortDescription,
  onRemoveShortDescription,
  onUpdateShortDescription,
  onAddImage,
  onRemoveImage,
  onUpdateImage,
}: iProductFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">{dictionary.form.name}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="price">{dictionary.form.price}</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price:
                  e.target.value === ""
                    ? ""
                    : parseFloat(e.target.value) || 0,
              })
            }
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock_quantity">{dictionary.form.stockQuantity}</Label>
          <Input
            id="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                stock_quantity:
                  e.target.value === ""
                    ? ""
                    : parseInt(e.target.value, 10) || 0,
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
            onValueChange={(value) => setFormData({ ...formData, is_active: value === "true" })}
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
      <div className="space-y-2">
        <Label htmlFor="category">{dictionary.form.category}</Label>
        <ProductFormCategoryTree
          categories={categories}
          value={formData.category || null}
          onChange={(categoryId) =>
            setFormData({
              ...formData,
              category: categoryId ?? 0,
            })
          }
          placeholder={dictionary.form.category}
        />
        {formData.category === 0 && (
          <p className="text-destructive text-xs">Category is required</p>
        )}
      </div>
      <ShortDescriptionField
        items={formData.short_description}
        onAdd={onAddShortDescription}
        onRemove={onRemoveShortDescription}
        onUpdate={onUpdateShortDescription}
        dictionary={dictionary}
      />
      <ProductFormImages
        images={formData.images}
        dictionary={dictionary}
        onAdd={onAddImage}
        onRemove={onRemoveImage}
        onUpdate={onUpdateImage}
      />
      <div className="space-y-2">
        <Label htmlFor="description">{dictionary.form.description}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
        />
      </div>
    </>
  )
}
