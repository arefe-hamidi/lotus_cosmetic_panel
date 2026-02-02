"use client"

import type { iLocale } from "@/Components/Entity/Locale/types"
import type { iBrand, iBrandFormState } from "../type"
import type { iDictionary } from "../i18n"
import ImageUploader from "@/Components/Entity/ImageUploader/ImageUploader"
import Button from "@/Components/Shadcn/button"
import Input from "@/Components/Shadcn/input"
import Label from "@/Components/Shadcn/label"
import { Switch } from "@/Components/Shadcn/switch"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/Components/Shadcn/sheet"

interface iProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  editingBrand: iBrand | null
  formData: iBrandFormState
  setFormData: (data: iBrandFormState) => void
  onSubmit: (e: React.FormEvent) => void
  dictionary: iDictionary
  locale: iLocale
  isPending: boolean
}

export default function BrandForm({
  isOpen,
  setIsOpen,
  editingBrand,
  formData,
  setFormData,
  onSubmit,
  dictionary,
  locale,
  isPending,
}: iProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side={locale === "fa" ? "left" : "right"}>
        <SheetHeader>
          <SheetTitle>
            {editingBrand ? dictionary.editBrand : dictionary.addBrand}
          </SheetTitle>
          <SheetDescription>{dictionary.description}</SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name">{dictionary.form.name}</Label>
            <Input
              id="brand-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={dictionary.form.namePlaceholder}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{dictionary.form.logo}</Label>
            <ImageUploader
              image={formData.logoPreviewUrl}
              appearance="ROW"
              triggerLabel={dictionary.form.uploadImage}
              removeLabel={dictionary.form.removeImage}
              onRemove={async () => {
                if (formData.logoPreviewUrl.startsWith("blob:")) {
                  URL.revokeObjectURL(formData.logoPreviewUrl)
                }
                setFormData({ ...formData, logoFile: null, logoPreviewUrl: "" })
                return true
              }}
              onCropComplete={async (blob) => {
                if (formData.logoPreviewUrl.startsWith("blob:")) {
                  URL.revokeObjectURL(formData.logoPreviewUrl)
                }
                setFormData({
                  ...formData,
                  logoFile: blob,
                  logoPreviewUrl: URL.createObjectURL(blob),
                })
                return true
              }}
            />
          </div>
          <div className="flex items-center justify-between space-y-0">
            <Label htmlFor="brand-is_active">{dictionary.form.isActive}</Label>
            <Switch
              id="brand-is_active"
              checked={formData.is_active ?? true}
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
  )
}
