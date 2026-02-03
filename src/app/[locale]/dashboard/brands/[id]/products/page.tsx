import type { iLocale } from "@/Components/Entity/Locale/types"
import { DEFAULT_LOCALE } from "@/Components/Entity/Locale/constants"
import DefaultLayout from "@/Components/Layout/DefaultLayout/DefaultLayout"
import BrandProducts from "@/Main/Dashboard/Brands/BrandProducts/BrandProducts"

interface iProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function Page({ params }: iProps) {
  const { locale, id } = await params
  const validLocale = (locale === "en" || locale === "fa" ? locale : DEFAULT_LOCALE) as iLocale

  return (
    <DefaultLayout locale={validLocale}>
      <BrandProducts locale={validLocale} productId={id} />
    </DefaultLayout>
  )
}
