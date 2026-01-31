"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";
import { useCreateProduct } from "./api";
import { useGetCategories } from "../../Category/api";
import type { iProductImage, iProductFormState } from "../type";
import { parseErrorResponse } from "@/lib/api/utils/parseError";
import { appRoutes } from "@/lib/routes/appRoutes";
import { CreateProductsHeader } from "./Components/CreateProductsHeader";
import { ProductFormFields } from "./Components/ProductFormFields";
import { ProductFormActions } from "./Components/ProductFormActions";

interface iProps {
  locale: iLocale;
}

export default function CreateProducts({ locale }: iProps) {
  const dictionary = getDictionary(locale);
  const router = useRouter();
  const { data: categories } = useGetCategories();
  const createMutation = useCreateProduct();

  const [formData, setFormData] = useState<iProductFormState>({
    name: "",
    description: "",
    short_description: [{ value: "", description: "" }],
    category: 0,
    price: "",
    stock_quantity: "",
    is_active: true,
    images: [],
  });

  const handleAddShortDescription = () => {
    setFormData({
      ...formData,
      short_description: [
        ...formData.short_description,
        { value: "", description: "" },
      ],
    });
  };

  const handleRemoveShortDescription = (index: number) => {
    setFormData({
      ...formData,
      short_description: formData.short_description.filter((_, i) => i !== index),
    });
  };

  const handleUpdateShortDescription = (
    index: number,
    field: "value" | "description",
    value: string
  ) => {
    const updated = [...formData.short_description];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      short_description: updated,
    });
  };

  const handleAddImage = () => {
    const nextOrder =
      formData.images.length > 0
        ? Math.max(...formData.images.map((img) => Number(img.order) ?? 0)) + 1
        : 0;
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
    });
  };

  const handleRemoveImage = (index: number) => {
    const next = formData.images.filter((_, i) => i !== index);
    const hadMain = formData.images[index]?.is_main;
    if (hadMain && next.length > 0 && !next.some((img) => img.is_main)) {
      next[0] = { ...next[0], is_main: true };
    }
    setFormData({ ...formData, images: next });
  };

  const handleUpdateImage = (
    index: number,
    field: keyof iProductImage,
    value: string | boolean | number | ""
  ) => {
    const updated = [...formData.images];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "is_main" && value === true) {
      updated.forEach((img, i) => {
        if (i !== index) updated[i] = { ...img, is_main: false };
      });
    }
    setFormData({ ...formData, images: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category === 0) {
      toast.error("Please select a category");
      return;
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
      };
      await createMutation.mutateAsync(payload);
      toast.success(dictionary.messages.success);
      router.push(appRoutes.dashboard.products.root(locale));
    } catch (error) {
      console.error("Failed to create product:", error);
      const errorMessage = await parseErrorResponse(
        error,
        dictionary.messages.error
      );
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full">
      <CreateProductsHeader locale={locale} dictionary={dictionary} />

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <ProductFormFields
            formData={formData}
            setFormData={setFormData}
            categories={categories}
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
            isPending={createMutation.isPending}
          />
        </form>
      </div>
    </div>
  );
}
