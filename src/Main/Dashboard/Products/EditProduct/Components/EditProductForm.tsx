"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { iLocale } from "@/Components/Entity/Locale/types"
import { getDictionary } from "../i18n"
import { useUpdateProduct, useDeleteProduct } from "../../api"
import { useGetBrands } from "../../../Brands/api"
import { useGetCategories } from "../../../Category/api"
import type { iProduct, iProductImage, iProductFormState } from "../../types"
import { productToFormState } from "../../utils"
import { parseErrorResponse } from "@/lib/api/utils/parseError"
import { appRoutes } from "@/lib/routes/appRoutes"
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/Shadcn/card"
import { ProductFormFields } from "../../CreateProducts/Components/ProductFormFields"
import { ProductFormActions } from "../../CreateProducts/Components/ProductFormActions"
import Button from "@/Components/Shadcn/button"
import { ArrowLeft } from "lucide-react"

interface iProps {
  product: iProduct
  locale: iLocale
  id: number
}

export default function EditProductForm({ product, locale, id }: iProps) {
  const dictionary = getDictionary(locale)
  const router = useRouter()
  const { data: categories } = useGetCategories()
  const { data: brands = [] } = useGetBrands()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()
  const [formData, setFormData] = useState<iProductFormState>(() => productToFormState(product))
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleAddShortDescription = () => {
    setFormData({
      ...formData,
      short_description: [...formData.short_description, { value: "", description: "" }],
    })
  }

  const handleRemoveShortDescription = (index: number) => {
    setFormData({
      ...formData,
      short_description: formData.short_description.filter((_, i) => i !== index),
    })
  }

  const handleUpdateShortDescription = (
    index: number,
    field: "value" | "description",
    value: string
  ) => {
    const updated = [...formData.short_description]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, short_description: updated })
  }

  const handleAddImage = () => {
    const nextOrder =
      formData.images.length > 0
        ? Math.max(...formData.images.map((img) => Number(img.order) ?? 0)) + 1
        : 0
    setFormData({
      ...formData,
      images: [
        ...formData.images,
        {
          path: "",
          description: "",
          alt_text: "",
          is_main: formData.images.length === 0,
          order: nextOrder,
        },
      ],
    })
  }

  const handleRemoveImage = (index: number) => {
    const next = formData.images.filter((_, i) => i !== index)
    const hadMain = formData.images[index]?.is_main
    if (hadMain && next.length > 0 && !next.some((img) => img.is_main)) {
      next[0] = { ...next[0], is_main: true }
    }
    setFormData({ ...formData, images: next })
  }

  const handleUpdateImage = (
    index: number,
    field: keyof iProductImage,
    value: string | boolean | number | ""
  ) => {
    const updated = [...formData.images]
    updated[index] = { ...updated[index], [field]: value }
    if (field === "is_main" && value === true) {
      updated.forEach((img, i) => {
        if (i !== index) updated[i] = { ...img, is_main: false }
      })
    }
    setFormData({ ...formData, images: updated })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.category === 0) {
      toast.error(dictionary.messages.categoryRequired)
      return
    }
    try {
      const payload = {
        ...formData,
        price: Number(formData.price) || 0,
        stock_quantity: Number(formData.stock_quantity) || 0,
        images: formData.images.map((img) => ({
          ...img,
          order: Number(img.order) ?? 0,
        })),
      }
      await updateMutation.mutateAsync({ id, data: payload })
      toast.success(dictionary.messages.success)
      router.push(appRoutes.dashboard.products.root(locale))
    } catch (err) {
      console.error("Failed to update product:", err)
      const errorMessage = await parseErrorResponse(err, dictionary.messages.error)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(appRoutes.dashboard.products.root(locale))}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {dictionary.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {dictionary.description}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <ProductFormFields
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              brands={brands}
              dictionary={dictionary}
              onAddShortDescription={handleAddShortDescription}
              onRemoveShortDescription={handleRemoveShortDescription}
              onUpdateShortDescription={handleUpdateShortDescription}
              onAddImage={handleAddImage}
              onRemoveImage={handleRemoveImage}
              onUpdateImage={handleUpdateImage}
            />

            <ProductFormActions
              locale={locale}
              dictionary={dictionary}
              isPending={updateMutation.isPending}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
