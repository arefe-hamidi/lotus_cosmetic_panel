import type { Metadata } from "next";
import type { iLocale } from "@/Components/Entity/Locale/types";
import { DEFAULT_LOCALE } from "@/Components/Entity/Locale/constants";
import { getDictionary } from "@/i18n";
import { getTextDirection } from "@/Components/Entity/Locale/direction";

interface iProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: iProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = (
    locale === "en" || locale === "fa" ? locale : DEFAULT_LOCALE
  ) as iLocale;
  const dictionary = getDictionary(validLocale);

  return {
    title: dictionary.seo.title,
    description: dictionary.seo.description,
  };
}

export default async function LocaleLayout({ children, params }: iProps) {
  const { locale } = await params;
  const validLocale = (
    locale === "en" || locale === "fa" ? locale : DEFAULT_LOCALE
  ) as iLocale;
  const direction = getTextDirection(validLocale);

  return (
    <div dir={direction} lang={validLocale}>
      {children}
    </div>
  );
}
