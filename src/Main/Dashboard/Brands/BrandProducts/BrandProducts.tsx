"use client"

import { useRouter } from "next/navigation"
import type { iLocale } from "@/Components/Entity/Locale/types"
import { appRoutes } from "@/lib/routes/appRoutes"
import { getDictionary } from "./i18n"
import { useGetBrand } from "./api"
import BrandProductsSection from "./Components/BrandProductsSection"

interface iProps {
  locale: iLocale
  productId: string
}

export default function BrandProducts({ locale, productId }: iProps) {
  const router = useRouter()
  const dictionary = getDictionary(locale)
  const brandId = Number(productId)
  const { data: brand, isLoading: brandLoading } = useGetBrand(
    Number.isNaN(brandId) ? null : brandId
  )

  const selectedBrand = brand && brand.id != null ? { id: brand.id, name: brand.name } : null

  const handleClose = () => {
    router.push(appRoutes.dashboard.brands.root(locale))
  }

  if (!Number.isNaN(brandId) && !brandLoading && !brand) {
    return (
      <div className="text-muted-foreground flex min-h-[200px] items-center justify-center p-8 text-center">
        <p className="text-sm">{dictionary.brandProducts.brandNotFound}</p>
        <button
          type="button"
          onClick={() => router.push(appRoutes.dashboard.brands.root(locale))}
          className="text-primary ml-2 underline"
        >
          {dictionary.brandProducts.backToBrands}
        </button>
      </div>
    )
  }

  if (brandLoading) {
    return (
      <div className="text-muted-foreground flex min-h-[200px] items-center justify-center p-8 text-center">
        <p className="text-sm">{dictionary.brandProducts.loading}</p>
      </div>
    )
  }

  return (
    <BrandProductsSection
      selectedBrand={selectedBrand}
      onClose={handleClose}
      locale={locale}
      dictionary={dictionary}
    />
  )
}
