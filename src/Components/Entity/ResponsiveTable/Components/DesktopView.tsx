import { cn } from "@/Components/Shadcn/lib/utils"
import Table, { TableBody, TableCell, TableRow } from "@/Components/Shadcn/table"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Fragment } from "react"
import { iResponsiveColumn, iRowData, iRtParams } from "../types"
import { resolvePolymorphicString } from "../utils"
import Skeleton from "@/Components/Shadcn/skeleton"

interface iProps<T extends iRowData> {
  data: Array<T>
  columns: Array<iResponsiveColumn<T>>
  className?: string | ((isMobile: boolean) => string)
  rowProps?: (params: iRtParams<T>) => React.HTMLAttributes<HTMLTableRowElement>
  renderExpanded?: (params: iRtParams<T>) => React.ReactNode
  isExpandable?: (params: iRtParams<T>) => boolean
  expandedIndexes: Set<number>
  setExpandedIndexes: (indexes: Set<number>) => void
  getRowKey: (row: T, index: number) => string | number
  isFetching?: boolean
  headerRow: React.ReactNode
  emptyMessage?: string
}

export default function DesktopView<T extends iRowData>({
  data,
  columns,
  className,
  rowProps,
  renderExpanded,
  isExpandable,
  expandedIndexes,
  setExpandedIndexes,
  getRowKey,
  isFetching,
  headerRow,
  emptyMessage,
}: iProps<T>) {
  const hasExpandableFeature = !!renderExpanded

  function isRowExpandable(params: iRtParams<T>) {
    if (!hasExpandableFeature) return false
    if (isExpandable) return isExpandable(params)
    return true
  }

  function rowPropsProvider(params: iRtParams<T>) {
    const finalRowProps = rowProps ? rowProps(params) : {}
    if (hasExpandableFeature && isRowExpandable(params)) {
      const passedOnClick = finalRowProps.onClick
      finalRowProps.onClick = (e) => {
        const newExpanded = new Set(expandedIndexes)
        if (newExpanded.has(params.index)) newExpanded.delete(params.index)
        else newExpanded.add(params.index)
        setExpandedIndexes(newExpanded)
        if (passedOnClick) passedOnClick(e)
      }
    }
    return finalRowProps
  }

  const visibleColumns = columns.filter((col) => {
    if (col.isDisable) return false
    if (col.isMobile === true) return false
    return true
  })

  return (
    <div className="animate-in fade-in relative w-full overflow-hidden rounded-xl duration-1000">
      <Table className={resolvePolymorphicString(className, false)}>
        {headerRow}
        <TableBody>
          {isFetching ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {hasExpandableFeature && <TableCell />}
                {visibleColumns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length > 0 ? (
            data.map((row, index) => {
              const isExpanded = expandedIndexes.has(index)
              const params: iRtParams<T> = {
                row,
                index,
                isMobile: false,
                isExpanded,
              }
              const rowExpandable = isRowExpandable(params)
              const providedRowProps = rowPropsProvider(params)
              const mergedRowClassName = cn(
                providedRowProps.className,
                renderExpanded &&
                  rowExpandable &&
                  isExpanded &&
                  "border-b-0 bg-transparent hover:bg-transparent"
              )
              return (
                <Fragment key={getRowKey(row, index)}>
                  <TableRow {...providedRowProps} className={mergedRowClassName}>
                    {hasExpandableFeature ? (
                      <TableCell
                        className={cn({
                          "bg-muted-foreground/25 rounded-bl-2xl": rowExpandable && isExpanded,
                        })}
                        key="expand-cell"
                      >
                        {rowExpandable && (
                          <>{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</>
                        )}
                      </TableCell>
                    ) : null}
                    {visibleColumns.map((col, colIndex) => {
                      return (
                        <TableCell
                          key={colIndex}
                          className={cn({
                            "bg-muted-foreground/25": rowExpandable && isExpanded,
                            "rounded-br-2xl":
                              rowExpandable && isExpanded && colIndex === visibleColumns.length - 1,
                          })}
                        >
                          {col.cell(params)}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                  {hasExpandableFeature && rowExpandable && isExpanded && renderExpanded && (
                    <TableRow className="animate-in fade-in border-b-0 bg-none duration-500 hover:bg-transparent">
                      <TableCell colSpan={visibleColumns.length + 1} className="pt-0">
                        <div className="bg-muted/25 border-muted mb-6 rounded-bl-2xl rounded-br-2xl border border-t-0 p-4">
                          {renderExpanded(params)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length + (hasExpandableFeature ? 1 : 0)}
                className="text-muted-foreground h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
