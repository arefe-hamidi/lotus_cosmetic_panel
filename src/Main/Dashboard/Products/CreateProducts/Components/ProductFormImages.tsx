"use client"

import type { iProductFormState, iProductImage } from "../../types"
import type { iDictionary } from "../i18n"
import ImageUploader from "@/Components/Entity/ImageUploader/ImageUploader"
import Badge from "@/Components/Shadcn/badge"
import Button from "@/Components/Shadcn/button"
import Card, { CardContent, CardHeader } from "@/Components/Shadcn/card"
import Input from "@/Components/Shadcn/input"
import Label from "@/Components/Shadcn/label"
import { getMediaUrl } from "@/lib/configs/constants"
import { ImageIcon, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface iProductFormImagesProps {
  images: iProductFormState["images"]
  dictionary: iDictionary
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (
    index: number,
    field: keyof iProductImage,
    value: string | boolean | number | ""
  ) => void
}

export function ProductFormImages({
  images,
  dictionary,
  onAdd,
  onRemove,
  onUpdate,
}: iProductFormImagesProps) {
  /** Display URL from upload response (keyed by path) so image shows even if getMediaUrl env is wrong */
  const [displayUrlByPath, setDisplayUrlByPath] = useState<Record<string, string>>({})

  /** Resolve display URL: full URL as-is, else upload cache, else getMediaUrl(relative path) for edit mode. */
  const getImageUrl = (path: string) => {
    if (!path) return undefined
    if (path.startsWith("http://") || path.startsWith("https://")) return path
    return displayUrlByPath[path] ?? getMediaUrl(path)
  }

  return (
    <div className="space-y-5">
      {images.length === 0 ? (
        <div
          className="border-border bg-muted/30 flex min-h-[180px] flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-10"
          role="status"
          aria-label={dictionary.form.noImages}
        >
          <div className="bg-muted rounded-full p-4">
            <ImageIcon className="text-muted-foreground size-8" />
          </div>
          <p className="text-muted-foreground max-w-sm text-center text-sm">
            {dictionary.form.noImages}
          </p>
          <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
            <Plus className="mr-2 size-4" />
            {dictionary.form.addImage}
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {images.map((img, index) => (
            <Card key={index} className={img.is_main ? "ring-primary/20 ring-2" : undefined}>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">
                    {dictionary.form.image} {index + 1}
                  </span>
                  {img.is_main && (
                    <Badge variant="secondary" className="text-xs">
                      {dictionary.form.isMainImage}
                    </Badge>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive size-8"
                  onClick={() => onRemove(index)}
                  aria-label={`${dictionary.form.removeImage} ${index + 1}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-5 pt-0">
                <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs font-medium">
                      {dictionary.form.imagePath}
                    </Label>
                    <ImageUploader
                      image={getImageUrl(img.path)}
                      appearance="ROW"
                      triggerLabel={dictionary.form.uploadImage}
                      removeLabel={dictionary.form.removeImage}
                      onRemove={async () => {
                        setDisplayUrlByPath((prev) => {
                          const next = { ...prev }
                          if (img.path) delete next[img.path]
                          return next
                        })
                        onUpdate(index, "path", "")
                        return true
                      }}
                      onChange={async (data) => {
                        setDisplayUrlByPath((prev) => ({
                          ...prev,
                          [data.path]: data.url,
                        }))
                        onUpdate(index, "path", data.path)
                        return true
                      }}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`img-desc-${index}`} className="text-xs">
                        {dictionary.form.imageDescription}
                      </Label>
                      <Input
                        id={`img-desc-${index}`}
                        value={img.description}
                        onChange={(e) => onUpdate(index, "description", e.target.value)}
                        placeholder={dictionary.form.imageDescriptionPlaceholder}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`img-alt-${index}`} className="text-xs">
                        {dictionary.form.altText}
                      </Label>
                      <Input
                        id={`img-alt-${index}`}
                        value={img.alt_text}
                        onChange={(e) => onUpdate(index, "alt_text", e.target.value)}
                        placeholder={dictionary.form.altTextPlaceholder}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-muted/40 flex flex-wrap items-center gap-6 rounded-lg px-4 py-3">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      id={`img-main-${index}`}
                      name="mainImage"
                      checked={img.is_main}
                      onChange={() => onUpdate(index, "is_main", true)}
                      className="size-4"
                    />
                    <span className="text-sm font-medium">{dictionary.form.isMainImage}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={`img-order-${index}`}
                      className="text-muted-foreground shrink-0 text-sm"
                    >
                      {dictionary.form.order}
                    </Label>
                    <Input
                      id={`img-order-${index}`}
                      type="number"
                      min={0}
                      className="h-8 w-16 shrink-0 text-center"
                      value={img.order}
                      onChange={(e) =>
                        onUpdate(
                          index,
                          "order",
                          e.target.value === "" ? "" : parseInt(e.target.value, 10) || 0
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="w-full border-dashed"
          >
            <Plus className="mr-2 size-4" />
            {dictionary.form.addImage}
          </Button>
        </div>
      )}
    </div>
  )
}
