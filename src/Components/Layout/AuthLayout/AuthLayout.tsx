"use client";

import Link from "next/link";

import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";
import LanguageSwitcher from "@/Components/Entity/Locale/LanguageSwitcher";
import ThemeSwitcher from "@/Components/Entity/Theme/Components/ThemeSwitcher/ThemeSwitcher";

interface iProps {
  children: React.ReactNode;
  locale: iLocale;
}

export default function AuthLayout({ children, locale }: iProps) {
  const dictionary = getDictionary(locale);

  return (
    <div className="flex  w-full flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="text-xl font-bold">{dictionary.logo}</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher appearance="select" />
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
