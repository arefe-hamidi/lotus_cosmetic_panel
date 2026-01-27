"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";
import {
  useGetProducts,
  useDeleteProduct,
} from "./api";
import { useGetCategories } from "../Category/api";
import type { iProduct } from "./type";
import { parseErrorResponse } from "@/lib/api/utils/parseError";
import type { iResponsiveColumn } from "@/Components/Entity/ResponsiveTable/types";
import ResponsiveTable from "@/Components/Entity/ResponsiveTable/ResponsiveTable";
import Badge from "@/Components/Shadcn/badge";
import Button from "@/Components/Shadcn/button";
import DeleteConfirmation from "@/Components/Entity/DeleteConfirmation/DeleteConfirmation";
import { appRoutes } from "@/lib/routes/appRoutes";

interface iProps {
  locale: iLocale;
}

export default function Products({ locale }: iProps) {
  const dictionary = getDictionary(locale);
  const router = useRouter();
  const { data: products, isLoading } = useGetProducts();
  const { data: categories } = useGetCategories();
  const deleteMutation = useDeleteProduct();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<iProduct | null>(
    null
  );

  const handleConfirmDelete = async () => {
    if (productToDelete?.id) {
      try {
        await deleteMutation.mutateAsync(productToDelete.id);
        toast.success(dictionary.messages.deleted);
        setProductToDelete(null);
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error("Failed to delete product:", error);
        const errorMessage = await parseErrorResponse(
          error,
          dictionary.messages.error
        );
        toast.error(errorMessage);
      }
    }
  };

  const getCategoryName = (categoryId: number) => {
    return categories?.find((c) => c.id === categoryId)?.name || "-";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
      style: "currency",
      currency: "IRR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const columns: iResponsiveColumn<iProduct>[] = [
    {
      label: dictionary.table.name,
      cell: ({ row }) => (
        <div className="font-medium">{row.name}</div>
      ),
      sortField: "name",
    },
    {
      label: dictionary.table.category,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {getCategoryName(row.category)}
        </div>
      ),
      sortField: "category",
    },
    {
      label: dictionary.table.price,
      cell: ({ row }) => (
        <div className="font-medium">{formatPrice(row.price)}</div>
      ),
      sortField: "price",
    },
    {
      label: dictionary.table.stockQuantity,
      cell: ({ row }) => (
        <div>{row.stock_quantity}</div>
      ),
      sortField: "stock_quantity",
    },
    {
      label: dictionary.table.status,
      cell: ({ row }) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
      sortField: "is_active",
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
                router.push(appRoutes.dashboard.products.edit(locale, row.id));
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {dictionary.title}
          </h1>
          <p className="text-muted-foreground">{dictionary.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push(appRoutes.dashboard.products.create(locale))}>
            <Plus className="mr-2 h-4 w-4" />
            {dictionary.addProduct}
          </Button>
        </div>
      </div>

      <ResponsiveTable
        data={products || []}
        columns={columns}
        isFetching={isLoading}
        emptyMessage="No products found"
      />

      <DeleteConfirmation
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={dictionary.deleteProduct}
        description={dictionary.messages.deleteConfirm}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
