"use client";

import { useParams, useRouter, usePathname } from "next/navigation";

import type { iLocale } from "./types";
import { LOCALES, LOCALE_FULLNAME } from "./constants";
import { setLocaleToCookie } from "./utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Shadcn/select";
import Button from "@/Components/Shadcn/button";
import { cn } from "@/Components/Shadcn/lib/utils";

interface iProps {
  appearance?: "button" | "select";
  className?: string;
}

export default function LanguageSwitcher({
  appearance = "button",
  className,
}: iProps) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = (params.locale as iLocale) || "en";

  const switchLocale = (newLocale: iLocale) => {
    setLocaleToCookie(newLocale);

    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];

    let newPath: string;
    if (LOCALES.includes(firstSegment as iLocale)) {
      segments[0] = newLocale;
      newPath = "/" + segments.join("/");
    } else {
      newPath = `/${newLocale}${pathname}`;
    }

    router.push(newPath);
  };

  if (appearance === "select") {
    return (
      <Select value={currentLocale} onValueChange={switchLocale}>
        <SelectTrigger className={cn("w-[140px]", className)}>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {LOCALES.map((locale) => (
            <SelectItem key={locale} value={locale}>
              {LOCALE_FULLNAME[locale]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {LOCALES.map((locale) => (
        <Button
          key={locale}
          variant={currentLocale === locale ? "default" : "outline"}
          size="sm"
          onClick={() => switchLocale(locale)}
        >
          {LOCALE_FULLNAME[locale]}
        </Button>
      ))}
    </div>
  );
}

