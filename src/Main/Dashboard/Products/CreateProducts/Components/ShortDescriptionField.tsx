"use client";

import { Plus, Trash2 } from "lucide-react";
import type { iShortDescription } from "../../types";
import type { iDictionary } from "../i18n";
import Button from "@/Components/Shadcn/button";
import Card, { CardContent, CardFooter, CardHeader } from "@/Components/Shadcn/card";
import Input from "@/Components/Shadcn/input";
import Label from "@/Components/Shadcn/label";
import { Separator } from "@/Components/Shadcn/separator";

interface iShortDescriptionFieldProps {
  items: iShortDescription[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: "value" | "description", value: string) => void;
  dictionary: iDictionary;
}

export function ShortDescriptionField({
  items,
  onAdd,
  onRemove,
  onUpdate,
  dictionary,
}: iShortDescriptionFieldProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Label className="text-base font-medium">
          {dictionary.form.shortDescription}
        </Label>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {items.length === 0 ? (
          <div className="border-border flex min-h-[100px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed bg-muted/20 px-4 py-6">
            <p className="text-muted-foreground text-center text-sm">
              No short description items yet.
            </p>
            <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
              <Plus className="mr-2 size-4" />
              {dictionary.form.addShortDescription}
            </Button>
          </div>
        ) : (
          <>
            {items.map((item, index) => (
              <div key={index}>
                <div className="border-border flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-start">
                  <div className="flex flex-1 flex-col gap-4 sm:grid sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`short-value-${index}`}
                        className="text-xs font-medium text-muted-foreground"
                      >
                        {dictionary.form.value}
                      </Label>
                      <Input
                        id={`short-value-${index}`}
                        value={item.value}
                        onChange={(e) =>
                          onUpdate(index, "value", e.target.value)
                        }
                        placeholder={dictionary.form.valuePlaceholder}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`short-desc-${index}`}
                        className="text-xs font-medium text-muted-foreground"
                      >
                        {dictionary.form.descriptionLabel}
                      </Label>
                      <Input
                        id={`short-desc-${index}`}
                        value={item.description}
                        onChange={(e) =>
                          onUpdate(index, "description", e.target.value)
                        }
                        placeholder={dictionary.form.descriptionLabelPlaceholder}
                        className="h-9"
                      />
                    </div>
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive size-9 shrink-0 sm:mt-7"
                      onClick={() => onRemove(index)}
                      aria-label={`Remove item ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
                {index < items.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </>
        )}
      </CardContent>
      {items.length > 0 && (
        <CardFooter className="border-t pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="w-full border-dashed"
          >
            <Plus className="mr-2 size-4" />
            {dictionary.form.addShortDescription}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
