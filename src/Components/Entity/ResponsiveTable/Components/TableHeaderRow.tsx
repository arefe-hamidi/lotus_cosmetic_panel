import { cn } from "@/Components/Shadcn/lib/utils"
import { TableHead, TableHeader, TableRow } from "@/Components/Shadcn/table"
import { iResponsiveColumn, iRowData, iSortIconResult } from "../types"
import { getVisibleColumns, resolvePolymorphicLabel } from "../utils"
import SortIcon from "./SortIcon"

interface iProps<T extends iRowData> {
  columns: Array<iResponsiveColumn<T>>
  hasExpandableFeature: boolean
  handleSortClick: (sortField: string) => void
  getSortIcon: (sortField?: string) => iSortIconResult
}

export default function TableHeaderRow<T extends iRowData>({
  columns,
  hasExpandableFeature,
  handleSortClick,
  getSortIcon,
}: iProps<T>) {
  const visibleColumns = getVisibleColumns(columns, false)

  return (
    <TableHeader className="border-b">
      <TableRow className="hover:bg-inherit">
        {hasExpandableFeature && <TableHead key="expand-column" className="w-1/24" />}
        {visibleColumns.map((col, colIndex) => {
          const isSortable = !!col.sortField
          const sortIcon = getSortIcon(col.sortField)
          const labelClassName = col.labelClassName
            ? typeof col.labelClassName === "string"
              ? col.labelClassName
              : col.labelClassName(false)
            : ""
          return (
            <TableHead
              key={colIndex}
              className={cn(
                isSortable && "hover:bg-muted/50 word-break cursor-pointer select-none px-1",
                labelClassName
              )}
              onClick={() => isSortable && handleSortClick(col.sortField!)}
            >
              {resolvePolymorphicLabel(col, false)}
              {isSortable && <SortIcon {...sortIcon} />}
            </TableHead>
          )
        })}
      </TableRow>
    </TableHeader>
  )
}
