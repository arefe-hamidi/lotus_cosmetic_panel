"use client"

import { useState } from "react"
import Image from "next/image"
import { Image as ImageIcon, Plus } from "lucide-react"
import { toast } from "sonner"
import type { iLocale } from "@/Components/Entity/Locale/types"
import { getDictionary } from "./i18n"
import { useGetBrands, useCreateBrand } from "./api"
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
import BrandForm from "./Components/BrandForm"

interface iProps {
  locale: iLocale
}

export default function Brands({ locale }: iProps) {
  const dictionary = getDictionary(locale)
  const { data: brands = [], isLoading } = useGetBrands()
  const createMutation = useCreateBrand()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [formData, setFormData] = useState<iBrandFormState>({
    name: "",
    is_active: true,
    logoFile: null,
    logoPreviewUrl: "",
  })

  const handleOpenSheet = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = new FormData()
      body.append("name", formData.name)
      body.append("is_active", formData.is_active ? "true" : "false")
      if (formData.logoFile) {
        const ext = formData.logoFile.type?.includes("png") ? "png" : "jpg"
        body.append("logo", formData.logoFile, `logo.${ext}`)
      }
      await createMutation.mutateAsync(body)
      toast.success(dictionary.messages.success)
      if (formData.logoPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(formData.logoPreviewUrl)
      }
      setFormData({
        name: "",
        is_active: true,
        logoFile: null,
        logoPreviewUrl: "",
      })
      setSheetOpen(false)
    } catch (error) {
      console.error("Failed to create brand:", error)
      const errorMessage = await parseErrorResponse(error, dictionary.messages.error)
      toast.error(errorMessage)
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
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {dictionary.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {dictionary.description}
            </CardDescription>
          </div>
          <CardActions className="pt-0">
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
            <div className="p-4">
              <ResponsiveTable
                data={brands}
                columns={columns}
                isFetching={false}
                emptyMessage={dictionary.messages.noBrands}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <BrandForm
        isOpen={sheetOpen}
        setIsOpen={setSheetOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        dictionary={dictionary}
        locale={locale}
        isPending={createMutation.isPending}
      />
    </div>
  )
}
