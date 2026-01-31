"use client";

import type { iProductFormState, iProductImage } from "../../type";
import type { iDictionary } from "../i18n";
import ImageUploader from "@/Components/Entity/ImageUploader/ImageUploader";
import Button from "@/Components/Shadcn/button";
import Input from "@/Components/Shadcn/input";
import Label from "@/Components/Shadcn/label";
import { getMediaUrl } from "@/lib/configs/constants";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface iProductFormImagesProps {
  images: iProductFormState["images"];
  dictionary: iDictionary;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (
    index: number,
    field: keyof iProductImage,
    value: string | boolean | number | ""
  ) => void;
}

export function ProductFormImages({
  images,
  dictionary,
  onAdd,
  onRemove,
  onUpdate,
}: iProductFormImagesProps) {
  /** Display URL from upload response (keyed by path) so image shows even if getMediaUrl env is wrong */
  const [displayUrlByPath, setDisplayUrlByPath] = useState<Record<string, string>>({});

  const getImageUrl = (path: string) =>
    (path && displayUrlByPath[path]) ?? (path ? getMediaUrl(path) : undefined);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{dictionary.form.images}</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1 size-4" />
          {dictionary.form.addImage}
        </Button>
      </div>
      {images.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {dictionary.form.noImages}
        </p>
      ) : (
        <div className="space-y-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="border-border flex flex-col gap-4 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  {dictionary.form.image} {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{dictionary.form.imagePath}</Label>
                  <ImageUploader
                    image={getImageUrl(img.path)}
                    appearance="ROW"
                    triggerLabel={dictionary.form.uploadImage}
                    removeLabel={dictionary.form.removeImage}
                    onRemove={async () => {
                      setDisplayUrlByPath((prev) => {
                        const next = { ...prev };
                        if (img.path) delete next[img.path];
                        return next;
                      });
                      onUpdate(index, "path", "");
                      return true;
                    }}
                    onChange={async (data) => {
                      setDisplayUrlByPath((prev) => ({ ...prev, [data.path]: data.url }));
                      onUpdate(index, "path", data.path);
                      return true;
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`img-desc-${index}`}>
                      {dictionary.form.imageDescription}
                    </Label>
                    <Input
                      id={`img-desc-${index}`}
                      value={img.description}
                      onChange={(e) =>
                        onUpdate(index, "description", e.target.value)
                      }
                      placeholder={dictionary.form.imageDescriptionPlaceholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`img-alt-${index}`}>
                      {dictionary.form.altText}
                    </Label>
                    <Input
                      id={`img-alt-${index}`}
                      value={img.alt_text}
                      onChange={(e) =>
                        onUpdate(index, "alt_text", e.target.value)
                      }
                      placeholder={dictionary.form.altTextPlaceholder}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`img-main-${index}`}
                        name="mainImage"
                        checked={img.is_main}
                        onChange={() => onUpdate(index, "is_main", true)}
                      />
                      <Label
                        htmlFor={`img-main-${index}`}
                        className="cursor-pointer font-normal"
                      >
                        {dictionary.form.isMainImage}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`img-order-${index}`}
                        className="text-muted-foreground whitespace-nowrap text-sm"
                      >
                        {dictionary.form.order}
                      </Label>
                      <Input
                        id={`img-order-${index}`}
                        type="number"
                        min={0}
                        className="w-20"
                        value={img.order}
                        onChange={(e) =>
                          onUpdate(
                            index,
                            "order",
                            e.target.value === ""
                              ? ""
                              : parseInt(e.target.value, 10) || 0
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
