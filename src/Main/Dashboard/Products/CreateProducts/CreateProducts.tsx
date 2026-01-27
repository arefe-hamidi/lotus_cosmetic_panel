"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";
import { useCreateProduct } from "./api";
import { useGetCategories } from "../../Category/api";
import type { iProductRequest } from "../type";
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

  const [formData, setFormData] = useState<iProductRequest>({
    name: "",
    description: "",
    short_description: [{ value: "", description: "" }],
    category: 0,
    price: 0,
    stock_quantity: 0,
    is_active: true,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category === 0) {
      toast.error("Please select a category");
      return;
    }
    try {
      await createMutation.mutateAsync(formData);
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
