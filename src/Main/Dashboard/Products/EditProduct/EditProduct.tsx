"use client"

import { useRouter } from "next/navigation"
import type { iLocale } from "@/Components/Entity/Locale/types"
import { useGetProduct } from "../api"
import { appRoutes } from "@/lib/routes/appRoutes"
import Card, { CardContent, CardHeader } from "@/Components/Shadcn/card"
import Button from "@/Components/Shadcn/button"
import { ArrowLeft } from "lucide-react"
import Skeleton from "@/Components/Shadcn/skeleton"
import EditProductForm from "./Components/EditProductForm"

interface iProps {
  locale: iLocale
  productId: string
}

export default function EditProduct({ locale, productId }: iProps) {
  const router = useRouter()
  const id = productId ? parseInt(productId, 10) : NaN
  const { data: product, isLoading, isError, error } = useGetProduct(Number.isFinite(id) ? id : null)

  if (!Number.isFinite(id)) {
    return (
      <div className="text-muted-foreground flex min-h-[200px] items-center justify-center p-8 text-center">
        <p className="text-sm">Invalid product ID</p>
        <Button
          variant="link"
          className="mt-2"
          onClick={() => router.push(appRoutes.dashboard.products.root(locale))}
        >
          Back to products
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="text-muted-foreground flex min-h-[200px] flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-sm">
          {error instanceof Response ? "Product not found" : "Failed to load product"}
        </p>
        <Button
          variant="outline"
          onClick={() => router.push(appRoutes.dashboard.products.root(locale))}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to products
        </Button>
      </div>
    )
  }

  return (
    <EditProductForm key={product.id ?? id} product={product} locale={locale} id={id} />
  )
}
