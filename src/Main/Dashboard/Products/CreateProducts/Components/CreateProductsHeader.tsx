"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { iLocale } from "@/Components/Entity/Locale/types";
import type { iDictionary } from "../i18n";
import { appRoutes } from "@/lib/routes/appRoutes";
import Button from "@/Components/Shadcn/button";

interface iCreateProductsHeaderProps {
  locale: iLocale;
  dictionary: iDictionary;
}

export function CreateProductsHeader({
  locale,
  dictionary,
}: iCreateProductsHeaderProps) {
  const router = useRouter();

  return (
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
  );
}
