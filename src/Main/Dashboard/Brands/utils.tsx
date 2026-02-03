import Image from "next/image"
import { Image as ImageIcon, Pencil, Package, Trash2 } from "lucide-react"
import type { iBrand } from "./types"
import type { iDictionary } from "./i18n"
import type { iResponsiveColumn } from "@/Components/Entity/ResponsiveTable/types"
import Badge from "@/Components/Shadcn/badge"
import Button from "@/Components/Shadcn/button"

export interface iBrandTableHandlers {
  onEdit: (brand: iBrand) => void
  onDelete: (brand: iBrand) => void
  onViewProducts: (brand: iBrand) => void
}

export function getBrandTableColumns(
  dictionary: iDictionary,
  handlers: iBrandTableHandlers
): iResponsiveColumn<iBrand>[] {
  return [
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
          {row.is_active !== false
            ? dictionary.table.statusActive
            : dictionary.table.statusInactive}
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
            onClick={() => handlers.onViewProducts(row)}
            aria-label={dictionary.brandProducts.viewProducts}
          >
            <Package className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlers.onEdit(row)}
            aria-label={dictionary.editBrand}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
            onClick={() => handlers.onDelete(row)}
            aria-label={dictionary.deleteBrand}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]
}
