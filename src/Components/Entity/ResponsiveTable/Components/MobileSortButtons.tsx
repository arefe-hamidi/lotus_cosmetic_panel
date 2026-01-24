import Button from "@/Components/Shadcn/button"
import { cn } from "@/Components/Shadcn/lib/utils"
import { iResponsiveColumn, iRowData, iSortIconResult } from "../types"
import { getVisibleColumns, resolvePolymorphicLabel } from "../utils"
import SortIcon from "./SortIcon"

interface iProps<T extends iRowData> {
    columns: Array<iResponsiveColumn<T>>
    currentSortField?: string
    handleSortClick: (sortField: string) => void
    getSortIcon: (sortField?: string) => iSortIconResult
}

export default function MobileSortButtons<T extends iRowData>({
    columns,
    currentSortField,
    handleSortClick,
    getSortIcon
}: iProps<T>) {
    const visibleColumns = getVisibleColumns(columns, true).filter(col => !!col.sortField)

    if (visibleColumns.length === 0) return null

    return (
        <div className="mb-4 flex flex-wrap gap-2 pt-1">
            {visibleColumns.map((col, colIndex) => {
                const isSortable = !!col.sortField
                const sortIcon = getSortIcon(col.sortField)
                return (
                    <Button
                        key={colIndex}
                        variant="outline"
                        size="sm"
                        className={cn(
                            "flex items-center gap-1 text-xs",
                            currentSortField === col.sortField && "bg-muted"
                        )}
                        onClick={() => isSortable && handleSortClick(col.sortField!)}
                    >
                        {resolvePolymorphicLabel(col, true)}
                        {isSortable && <SortIcon {...sortIcon} />}
                    </Button>
                )
            })}
        </div>
    )
}
