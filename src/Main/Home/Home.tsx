import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";

interface iProps {
  locale: iLocale;
}

export default function Home({ locale }: iProps) {
  const dictionary = getDictionary(locale);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
      <div className="container px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {dictionary.welcome}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
