"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ImageIcon, Plus, Pencil } from "lucide-react"
import { toast } from "sonner"
import type { iLocale } from "@/Components/Entity/Locale/types"
import { getDictionary } from "./i18n"
import { useGetProducts, useDeleteProduct } from "./api"
import { useGetCategories } from "../Category/api"
import type { iProductListItem } from "./type"
import { parseErrorResponse } from "@/lib/api/utils/parseError"
import type { iResponsiveColumn } from "@/Components/Entity/ResponsiveTable/types"
import ResponsiveTable from "@/Components/Entity/ResponsiveTable/ResponsiveTable"
import Badge from "@/Components/Shadcn/badge"
import Button from "@/Components/Shadcn/button"
import Card, {
  CardActions,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/Shadcn/card"
import DeleteConfirmation from "@/Components/Entity/DeleteConfirmation/DeleteConfirmation"
import FullPagination from "@/Components/Entity/FullPagination/FullPagination"
import { appRoutes } from "@/lib/routes/appRoutes"
import { DEFAULT_CURRENT_PAGE } from "@/Components/Entity/FullPagination/constants"

interface iProps {
  locale: iLocale
}

export default function Products({ locale }: iProps) {
  const dictionary = getDictionary(locale)
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE)
  const [pageSize, setPageSize] = useState(10)
  const { data, isLoading } = useGetProducts(currentPage, pageSize)
  const products = data?.results ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const { data: categories } = useGetCategories()
  const deleteMutation = useDeleteProduct()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<iProductListItem | null>(null)

  const handleConfirmDelete = async () => {
    if (productToDelete?.id) {
      try {
        await deleteMutation.mutateAsync(productToDelete.id)
        toast.success(dictionary.messages.deleted)
        setProductToDelete(null)
        setDeleteDialogOpen(false)
      } catch (error) {
        console.error("Failed to delete product:", error)
        const errorMessage = await parseErrorResponse(error, dictionary.messages.error)
        toast.error(errorMessage)
      }
    }
  }

  const getCategoryName = (categoryId: number) => {
    return categories?.find((c) => c.id === categoryId)?.name || "-"
  }

  const formatPrice = (price: string | number) => {
    const num = typeof price === "string" ? parseFloat(price) : price
    return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
      style: "currency",
      currency: "IRR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page)
    setPageSize(size)
  }

  const columns: iResponsiveColumn<iProductListItem>[] = [
    {
      label: dictionary.table.photo,
      cell: ({ row }) => {
        const src = row.main_image ?? row.image_url
        return (
          <div className="bg-muted relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
            {src ? (
              <Image
                src={src}
                alt={row.name}
                fill
                className="object-cover"
                sizes="40px"
                unoptimized={src.startsWith("http")}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="text-muted-foreground h-5 w-5" />
              </div>
            )}
          </div>
        )
      },
    },
    {
      label: dictionary.table.name,
      cell: ({ row }) => <div className="font-medium">{row.name}</div>,
    },
    {
      label: dictionary.table.category,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.category_name ?? getCategoryName(row.category)}
        </div>
      ),
    },
    {
      label: dictionary.table.price,
      cell: ({ row }) => <div className="font-medium">{formatPrice(row.price)}</div>,
    },
    {
      label: dictionary.table.stockQuantity,
      cell: ({ row }) => <div>{row.stock_quantity}</div>,
    },
    {
      label: dictionary.table.status,
      cell: ({ row }) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      label: dictionary.table.actions,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              if (row.id) {
                router.push(appRoutes.dashboard.products.edit(locale, row.id))
              }
            }}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">{dictionary.editProduct}</span>
          </Button>
        </div>
      ),
      isDisable: true,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight">{dictionary.title}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {dictionary.description}
            </CardDescription>
          </div>
          <CardActions className="pt-0">
            <Button onClick={() => router.push(appRoutes.dashboard.products.create(locale))}>
              <Plus className="mr-2 h-4 w-4" />
              {dictionary.addProduct}
            </Button>
          </CardActions>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <ResponsiveTable
                data={[]}
                columns={columns}
                isFetching={true}
                emptyMessage={dictionary.messages.noProducts}
              />
            </div>
          ) : data === undefined || products.length === 0 ? (
            <div className="text-muted-foreground flex min-h-[200px] items-center justify-center p-8 text-center">
              <p className="text-sm">{dictionary.messages.noProducts}</p>
            </div>
          ) : (
            <>
              <div className="p-4">
                <ResponsiveTable
                  data={products}
                  columns={columns}
                  isFetching={false}
                  emptyMessage={dictionary.messages.noProducts}
                />
              </div>
              <div className=" px-4 pb-4">
                <FullPagination
                  currentPage={currentPage}
                  totalItems={totalCount}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  onChange={handlePaginationChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmation
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={dictionary.deleteProduct}
        description={dictionary.messages.deleteConfirm}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
