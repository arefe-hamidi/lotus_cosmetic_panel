"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ImageIcon, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { iLocale } from "@/Components/Entity/Locale/types"
import { appRoutes } from "@/lib/routes/appRoutes"
import { useTableUrlState } from "@/lib/hooks/useTableUrlState"
import { getDictionary } from "./i18n"
import { useGetProducts, useDeleteProduct } from "./api"
import { useGetCategories } from "../Category/api"
import type { iProductListItem } from "./types"
import { formatPrice, getCategoryName } from "./utils"
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
import Input from "@/Components/Shadcn/input"
import DeleteConfirmation from "@/Components/Entity/DeleteConfirmation/DeleteConfirmation"
import FullPagination from "@/Components/Entity/FullPagination/FullPagination"

interface iProps {
  locale: iLocale
}

export default function Products({ locale }: iProps) {
  const dictionary = getDictionary(locale)
  const router = useRouter()
  const {
    currentPage,
    pageSize,
    searchQuery,
    debouncedSearch,
    setSearchQuery,
    handlePaginationChange,
  } = useTableUrlState({ basePath: appRoutes.dashboard.products.root(locale) })

  const { data, isLoading } = useGetProducts(currentPage, pageSize, debouncedSearch)
  const products = data?.results ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const { data: categories } = useGetCategories()
  const deleteMutation = useDeleteProduct()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<iProductListItem | null>(null)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete?.id) return
    try {
      await deleteMutation.mutateAsync(productToDelete.id)
      toast.success(dictionary.messages.deleted)
      setProductToDelete(null)
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete product:", error)
      const errorMessage = await parseErrorResponse(error, dictionary.messages.error)
      toast.error(errorMessage)
      throw error
    }
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
          {row.category_name ?? getCategoryName(categories, row.category)}
        </div>
      ),
    },
    {
      label: dictionary.table.price,
      cell: ({ row }) => <div className="font-medium">{formatPrice(locale, row.price)}</div>,
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
      stickyRight: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              if (row.id) {
                router.push(appRoutes.dashboard.products.edit(locale, row.id))
              }
            }}
            aria-label={dictionary.editProduct}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
            onClick={() => {
              setProductToDelete(row)
              setDeleteDialogOpen(true)
            }}
            aria-label={dictionary.deleteProduct}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
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
          <CardActions className="flex flex-wrap items-center gap-3 pt-0">
            <div className="relative">
              <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={dictionary.searchPlaceholder}
                className="h-9 w-64 pl-9"
              />
            </div>
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
        confirmText={dictionary.deleteProduct}
        confirmLoadingText={dictionary.messages.deleting}
        cancelText={dictionary.form.cancel}
      />
    </div>
  )
}
