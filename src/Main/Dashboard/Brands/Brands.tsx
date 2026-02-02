"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Image as ImageIcon, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { iLocale } from "@/Components/Entity/Locale/types"
import { getDictionary } from "./i18n"
import { useGetBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from "./api"
import type { iBrand, iBrandFormState } from "./type"
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
import { DEFAULT_CURRENT_PAGE } from "@/Components/Entity/FullPagination/constants"
import BrandForm from "./Components/BrandForm"

interface iProps {
  locale: iLocale
}

export default function Brands({ locale }: iProps) {
  const dictionary = getDictionary(locale)
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  const { data, isLoading } = useGetBrands(currentPage, pageSize, debouncedSearch)
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
    setCurrentPage(DEFAULT_CURRENT_PAGE)
  }

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page)
    setPageSize(size)
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

  const columns: iResponsiveColumn<iBrand>[] = [
    {
      label: dictionary.table.logo,
      cell: ({ row }) => (
        <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
          {row.logo ? (
            <Image
              src={row.logo}
              alt={row.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <ImageIcon className="text-muted-foreground size-5" />
          )}
        </div>
      ),
    },
    {
      label: dictionary.table.name,
      cell: ({ row }) => <div className="font-medium">{row.name}</div>,
    },
    {
      label: dictionary.table.status,
      cell: ({ row }) => (
        <Badge variant={row.is_active !== false ? "default" : "secondary"}>
          {row.is_active !== false ? "Active" : "Inactive"}
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
            onClick={() => handleOpenEdit(row)}
            aria-label={dictionary.editBrand}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
            onClick={() => {
              setBrandToDelete(row)
              setDeleteDialogOpen(true)
            }}
            aria-label={dictionary.deleteBrand}
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
            <Button onClick={handleOpenSheet}>
              <Plus className="mr-2 h-4 w-4" />
              {dictionary.addBrand}
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
