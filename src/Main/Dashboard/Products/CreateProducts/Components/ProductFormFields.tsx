"use client"

import type { iProductImage, iProductFormState } from "../../types"
import type { iBrand } from "../../../Brands/types"
import type { iCategory } from "../../../Category/type"
import type { iDictionary } from "../i18n"
import Input from "@/Components/Shadcn/input"
import Label from "@/Components/Shadcn/label"
import Textarea from "@/Components/Shadcn/textarea"
import { Switch } from "@/Components/Shadcn/switch"
import { ProductFormBrandSelect } from "./ProductFormBrandSelect"
import { ProductFormCategoryTree } from "./ProductFormCategoryTree"
import { ProductFormImages } from "./ProductFormImages"
import { ShortDescriptionField } from "./ShortDescriptionField"

interface iProductFormFieldsProps {
  formData: iProductFormState
  setFormData: (data: iProductFormState) => void
  categories: iCategory[] | undefined
  brands: iBrand[] | undefined
  dictionary: iDictionary
  onAddShortDescription: () => void
  onRemoveShortDescription: (index: number) => void
  onUpdateShortDescription: (index: number, field: "value" | "description", value: string) => void
  onAddImage: () => void
  onRemoveImage: (index: number) => void
  onUpdateImage: (
    index: number,
    field: keyof iProductImage,
    value: string | boolean | number | ""
  ) => void
}

export function ProductFormFields({
  formData,
  setFormData,
  categories,
  brands,
  dictionary,
  onAddShortDescription,
  onRemoveShortDescription,
  onUpdateShortDescription,
  onAddImage,
  onRemoveImage,
  onUpdateImage,
}: iProductFormFieldsProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="grid gap-4 md:grid-cols-1">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{dictionary.form.name}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={dictionary.form.namePlaceholder}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">{dictionary.form.brand}</Label>
              <ProductFormBrandSelect
                value={formData.brand === 0 ? null : formData.brand}
                onChange={(brandId) =>
                  setFormData({
                    ...formData,
                    brand: brandId ?? 0,
                  })
                }
                placeholder={dictionary.form.brandPlaceholder}
                selectedBrand={brands?.find((b) => b.id === formData.brand)}
              />
            </div>
          </div>
          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">{dictionary.form.price}</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e.target.value === "" ? "" : parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder={dictionary.form.pricePlaceholder}
                    required
                    min="0"
                    step="0.01"
                    className="pr-14"
                  />
                  <span className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                    {dictionary.form.currency}
                  </span>
                </div>
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
                        e.target.value === "" ? "" : parseInt(e.target.value, 10) || 0,
                    })
                  }
                  placeholder={dictionary.form.stockQuantityPlaceholder}
                  required
                  min="0"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">{dictionary.form.isActive}</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>
          </section>
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
              placeholder={dictionary.form.categoryPlaceholder}
            />
            {formData.category === 0 && (
              <p className="text-destructive text-xs">{dictionary.messages.categoryRequired}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{dictionary.form.description}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={dictionary.form.descriptionPlaceholder}
              required
              rows={4}
              className="min-h-[100px] resize-y"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <ShortDescriptionField
          items={formData.short_description}
          onAdd={onAddShortDescription}
          onRemove={onRemoveShortDescription}
          onUpdate={onUpdateShortDescription}
          dictionary={dictionary}
        />
      </section>

      <section className="space-y-4">
        <ProductFormImages
          images={formData.images}
          dictionary={dictionary}
          onAdd={onAddImage}
          onRemove={onRemoveImage}
          onUpdate={onUpdateImage}
        />
      </section>
    </div>
  )
}
