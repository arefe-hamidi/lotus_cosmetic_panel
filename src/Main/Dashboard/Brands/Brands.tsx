"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"
import type { iLocale } from "@/Components/Entity/Locale/types"
import { appRoutes } from "@/lib/routes/appRoutes"
import { useTableUrlState } from "@/lib/hooks/useTableUrlState"
import { getDictionary } from "./i18n"
import { useGetBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from "./api"
import type { iBrand, iBrandFormState } from "./types"
import { getBrandTableColumns } from "./utils"
import { parseErrorResponse } from "@/lib/api/utils/parseError"
import ResponsiveTable from "@/Components/Entity/ResponsiveTable/ResponsiveTable"
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
import BrandForm from "./Components/BrandForm"

interface iProps {
  locale: iLocale
}

export default function Brands({ locale }: iProps) {
  const dictionary = getDictionary(locale)
  const router = useRouter()
  const {
    currentPage,
    pageSize,
    searchQuery,
    debouncedSearch,
    setSearchQuery,
    handlePaginationChange,
  } = useTableUrlState({ basePath: appRoutes.dashboard.brands.root(locale) })

  const { data, isLoading, error, refetch } = useGetBrands(currentPage, pageSize, debouncedSearch)
  const brands = Array.isArray(data) ? data : (data?.results ?? [])
  const totalCount = Array.isArray(data) ? 0 : (data?.count ?? 0)
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const createMutation = useCreateBrand()
  const updateMutation = useUpdateBrand()
  const deleteMutation = useDeleteBrand()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<iBrand | null>(null)
  const [brandToDelete, setBrandToDelete] = useState<iBrand | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState<iBrandFormState>({
    name: "",
    is_active: true,
    logoFile: null,
    logoPreviewUrl: "",
  })

  const handleOpenSheet = () => {
    setEditingBrand(null)
    if (formData.logoPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(formData.logoPreviewUrl)
    }
    setFormData({
      name: "",
      is_active: true,
      logoFile: null,
      logoPreviewUrl: "",
    })
    setSheetOpen(true)
  }

  const handleOpenEdit = (brand: iBrand) => {
    setEditingBrand(brand)
    if (formData.logoPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(formData.logoPreviewUrl)
    }
    setFormData({
      name: brand.name,
      is_active: brand.is_active !== false,
      logoFile: null,
      logoPreviewUrl: brand.logo ?? "",
    })
    setSheetOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingBrand?.id != null) {
        if (formData.logoFile) {
          const body = new FormData()
          body.append("name", formData.name)
          body.append("is_active", formData.is_active ? "true" : "false")
          const ext = formData.logoFile.type?.includes("png") ? "png" : "jpg"
          body.append("logo", formData.logoFile, `logo.${ext}`)
          await updateMutation.mutateAsync({ id: editingBrand.id, data: body })
        } else {
          await updateMutation.mutateAsync({
            id: editingBrand.id,
            data: {
              name: formData.name,
              is_active: formData.is_active,
              logo: editingBrand.logo,
            },
          })
        }
      } else {
        const body = new FormData()
        body.append("name", formData.name)
        body.append("is_active", formData.is_active ? "true" : "false")
        if (formData.logoFile) {
          const ext = formData.logoFile.type?.includes("png") ? "png" : "jpg"
          body.append("logo", formData.logoFile, `logo.${ext}`)
        }
        await createMutation.mutateAsync(body)
      }
      toast.success(dictionary.messages.success)
      if (formData.logoPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(formData.logoPreviewUrl)
      }
      setEditingBrand(null)
      setFormData({
        name: "",
        is_active: true,
        logoFile: null,
        logoPreviewUrl: "",
      })
      setSheetOpen(false)
    } catch (error) {
      console.error("Failed to save brand:", error)
      const errorMessage = await parseErrorResponse(error, dictionary.messages.error)
      toast.error(errorMessage)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleConfirmDelete = async () => {
    const id = brandToDelete?.id
    if (id == null || id === 0) {
      toast.error(dictionary.messages.error)
      setDeleteDialogOpen(false)
      setBrandToDelete(null)
      return
    }
    try {
      await deleteMutation.mutateAsync(id)
      toast.success(dictionary.messages.deleted)
      setBrandToDelete(null)
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete brand:", error)
      const errorMessage = await parseErrorResponse(error, dictionary.messages.error)
      toast.error(errorMessage)
      throw error
    }
  }

  const handleViewProducts = (brand: iBrand) => {
    const id = brand.id
    if (id != null && id > 0) {
      router.push(appRoutes.dashboard.brands.products(locale, id))
    }
  }

  const columns = getBrandTableColumns(dictionary, {
    onEdit: handleOpenEdit,
    onDelete: (row) => {
      setBrandToDelete(row)
      setDeleteDialogOpen(true)
    },
    onViewProducts: handleViewProducts,
  })

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
            <Button onClick={handleOpenSheet}>
              <Plus className="mr-2 h-4 w-4" />
              {dictionary.addBrand}
            </Button>
          </CardActions>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="text-muted-foreground flex min-h-[200px] flex-col items-center justify-center gap-3 p-8 text-center">
              <p className="text-sm">{dictionary.messages.loadError}</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                {dictionary.messages.retry}
              </Button>
            </div>
          ) : isLoading ? (
            <div className="p-4">
              <ResponsiveTable
                data={[]}
                columns={columns}
                isFetching={true}
                emptyMessage={dictionary.messages.noBrands}
              />
            </div>
          ) : brands.length === 0 ? (
            <div className="text-muted-foreground flex min-h-[200px] items-center justify-center p-8 text-center">
              <p className="text-sm">{dictionary.messages.noBrands}</p>
            </div>
          ) : (
            <>
              <div className="p-4">
                <ResponsiveTable
                  data={brands}
                  columns={columns}
                  isFetching={false}
                  emptyMessage={dictionary.messages.noBrands}
                />
              </div>
              <div className="px-4 pb-4">
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

      <BrandForm
        isOpen={sheetOpen}
        setIsOpen={(open) => {
          if (!open) setEditingBrand(null)
          setSheetOpen(open)
        }}
        editingBrand={editingBrand}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        dictionary={dictionary}
        locale={locale}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmation
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) setBrandToDelete(null)
        }}
        title={dictionary.deleteBrand}
        description={dictionary.messages.deleteConfirm}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        confirmText={dictionary.deleteBrand}
        confirmLoadingText={dictionary.messages.deleting}
        cancelText={dictionary.form.cancel}
      />
    </div>
  )
}
