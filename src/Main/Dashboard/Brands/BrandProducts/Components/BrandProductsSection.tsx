"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, Image as ImageIcon, Pencil } from "lucide-react"
import type { iLocale } from "@/Components/Entity/Locale/types"
import { appRoutes } from "@/lib/routes/appRoutes"
import { useGetBrandProducts } from "../api"
import type { iBrandProductListItem } from "../types"
import { formatPrice } from "../../../Products/utils"
import type { iDictionary } from "../i18n"
import type { iResponsiveColumn } from "@/Components/Entity/ResponsiveTable/types"
import ResponsiveTable from "@/Components/Entity/ResponsiveTable/ResponsiveTable"
import Badge from "@/Components/Shadcn/badge"
import Button from "@/Components/Shadcn/button"
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/Shadcn/card"
import FullPagination from "@/Components/Entity/FullPagination/FullPagination"
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE_OPTIONS,
} from "@/Components/Entity/FullPagination/constants"

interface iProps {
  selectedBrand: { id: number; name: string } | null
  onClose: () => void
  locale: iLocale
  dictionary: iDictionary
}

const DEFAULT_PRODUCTS_PAGE_SIZE = DEFAULT_PAGE_SIZE_OPTIONS[0] ?? 10

export default function BrandProductsSection({
  selectedBrand,
  onClose,
  locale,
  dictionary,
}: iProps) {
  const router = useRouter()
  const [productsPage, setProductsPage] = useState(DEFAULT_CURRENT_PAGE)
  const [productsPageSize, setProductsPageSize] = useState(DEFAULT_PRODUCTS_PAGE_SIZE)

  const { data: brandProductsData, isLoading: brandProductsLoading } = useGetBrandProducts(
    selectedBrand?.id ?? null,
    productsPage,
    productsPageSize
  )
  const brandProducts = brandProductsData?.results ?? []
  const brandProductsTotal = brandProductsData?.count ?? 0
  const brandProductsTotalPages = Math.max(1, Math.ceil(brandProductsTotal / productsPageSize))

  const handlePaginationChange = (page: number, size: number) => {
    setProductsPage(page)
    setProductsPageSize(size)
  }

  const handleEditProduct = (productId: number) => {
    router.push(appRoutes.dashboard.products.edit(locale, productId))
  }

  const brandProductColumns: iResponsiveColumn<iBrandProductListItem>[] = [
    {
      label: dictionary.brandProducts.productTable.photo,
      cell: ({ row }) => {
        const rawSrc = row.main_image ?? row.image_url ?? ""
        const src = typeof rawSrc === "string" ? rawSrc.trim() : ""
        const hasImage = src.length > 0
        return (
          <div className="bg-muted relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            {hasImage ? (
              <Image
                src={src}
                alt={row.name}
                fill
                className="object-cover"
                sizes="40px"
                unoptimized={src.startsWith("http")}
              />
            ) : (
              <ImageIcon className="text-muted-foreground h-5 w-5" aria-hidden />
            )}
          </div>
        )
      },
    },
    {
      label: dictionary.brandProducts.productTable.name,
      cell: ({ row }) => <div className="font-medium">{row.name}</div>,
    },
    {
      label: dictionary.brandProducts.productTable.category,
      cell: ({ row }) => <div className="text-muted-foreground">{row.category_name ?? "—"}</div>,
    },
    {
      label: dictionary.brandProducts.productTable.price,
      cell: ({ row }) => <div className="font-medium">{formatPrice(locale, row.price)}</div>,
    },
    {
      label: dictionary.brandProducts.productTable.stock,
      cell: ({ row }) => <div>{row.stock_quantity}</div>,
    },
    {
      label: dictionary.brandProducts.productTable.status,
      cell: ({ row }) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? dictionary.table.statusActive : dictionary.table.statusInactive}
        </Badge>
      ),
    },
    {
      label: dictionary.brandProducts.productTable.actions,
      stickyRight: true,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => row.id && handleEditProduct(row.id)}
          aria-label={dictionary.editBrand}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  if (selectedBrand == null) return null

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={dictionary.brandProducts.backToBrands}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {dictionary.brandProducts.title} — {selectedBrand.name}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {dictionary.brandProducts.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {brandProductsLoading ? (
          <div className="p-4">
            <ResponsiveTable
              data={[]}
              columns={brandProductColumns}
              isFetching={true}
              emptyMessage={dictionary.brandProducts.empty}
            />
          </div>
        ) : brandProducts.length === 0 ? (
          <div className="text-muted-foreground flex min-h-[120px] items-center justify-center p-6 text-center text-sm">
            {dictionary.brandProducts.empty}
          </div>
        ) : (
          <>
            <div className="p-4">
              <ResponsiveTable
                data={brandProducts}
                columns={brandProductColumns}
                isFetching={false}
                emptyMessage={dictionary.brandProducts.empty}
              />
            </div>
            <div className="px-4 pb-4">
              <FullPagination
                currentPage={productsPage}
                totalItems={brandProductsTotal}
                pageSize={productsPageSize}
                totalPages={brandProductsTotalPages}
                onChange={handlePaginationChange}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
