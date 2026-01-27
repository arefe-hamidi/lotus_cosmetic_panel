"use client";

import { useRouter } from "next/navigation";
import type { iLocale } from "@/Components/Entity/Locale/types";
import type { iDictionary } from "../i18n";
import { appRoutes } from "@/lib/routes/appRoutes";
import Button from "@/Components/Shadcn/button";

interface iProductFormActionsProps {
  locale: iLocale;
  dictionary: iDictionary;
  isPending: boolean;
}

export function ProductFormActions({
  locale,
  dictionary,
  isPending,
}: iProductFormActionsProps) {
  const router = useRouter();

  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push(appRoutes.dashboard.products.root(locale))}
      >
        {dictionary.form.cancel}
      </Button>
      <Button type="submit" disabled={isPending}>
        {dictionary.form.submit}
      </Button>
    </div>
  );
}
