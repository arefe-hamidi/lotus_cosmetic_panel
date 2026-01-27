import type { iLocale } from "@/Components/Entity/Locale/types";
import { DEFAULT_LOCALE } from "@/Components/Entity/Locale/constants";
import DefaultLayout from "@/Components/Layout/DefaultLayout/DefaultLayout";
import CreateProducts from "@/Main/Dashboard/Products/CreateProducts/CreateProducts";

interface iProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: iProps) {
  const { locale } = await params;
  const validLocale = (
    locale === "en" || locale === "fa" ? locale : DEFAULT_LOCALE
  ) as iLocale;

  return (
    <DefaultLayout locale={validLocale}>
      <CreateProducts locale={validLocale} />
    </DefaultLayout>
  );
}
