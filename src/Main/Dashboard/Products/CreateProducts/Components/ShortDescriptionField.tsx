"use client";

import { X, Plus } from "lucide-react";
import type { iShortDescription } from "../../type";
import type { iDictionary } from "../i18n";
import Button from "@/Components/Shadcn/button";
import Input from "@/Components/Shadcn/input";
import Label from "@/Components/Shadcn/label";
import Card, { CardContent, CardFooter, CardHeader } from "@/Components/Shadcn/card";

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
      <CardHeader>
        <Label>{dictionary.form.shortDescription}</Label>
      </CardHeader>
      <CardContent className="space-y-3">

        {items.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 items-start  "
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">
                  {dictionary.form.value}
                </Label>
                <Input
                  value={item.value}
                  onChange={(e) => onUpdate(index, "value", e.target.value)}
                  placeholder={dictionary.form.value}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">
                  {dictionary.form.descriptionLabel}
                </Label>
                <Input
                  value={item.description}
                  onChange={(e) =>
                    onUpdate(index, "description", e.target.value)
                  }
                  placeholder={dictionary.form.descriptionLabel}
                  className="h-9"
                />
              </div>
            </div>
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
                className="mt-6 h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="w-full border-dashed"
      >
          <Plus className="mr-2 h-4 w-4" />
          {dictionary.form.addShortDescription}
        </Button>
      </CardFooter>
    </Card>
  );
}
