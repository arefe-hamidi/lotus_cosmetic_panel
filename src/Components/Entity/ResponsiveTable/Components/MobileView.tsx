import Card, { CardContent } from "@/Components/Shadcn/card"
import { cn } from "@/Components/Shadcn/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Fragment } from "react"
import { iResponsiveColumn, iRowData, iRtParams } from "../types"
import { resolvePolymorphicLabel, resolvePolymorphicString } from "../utils"
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
    sortButtons?: React.ReactNode
    emptyMessage?: string
}

export default function MobileView<T extends iRowData>({
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
    sortButtons,
    emptyMessage
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
            finalRowProps.onClick = e => {
                const newExpanded = new Set(expandedIndexes)
                if (newExpanded.has(params.index)) newExpanded.delete(params.index)
                else newExpanded.add(params.index)
                setExpandedIndexes(newExpanded)
                if (passedOnClick) passedOnClick(e)
            }
        }
        return finalRowProps
    }

    const visibleColumns = columns.filter(col => {
        if (col.isDisable) return false
        if (col.isMobile === false) return false
        return true
    })

    return (
        <>
            {sortButtons}
            <div
                className={cn(
                    "animate-in fade-in relative w-full overflow-hidden rounded-xl duration-1000",
                    resolvePolymorphicString(className, true)
                )}
            >
                <div className="w-full space-y-3">
                    {isFetching ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4 space-y-3">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                </CardContent>
                            </Card>
                        ))
                    ) : data.length > 0 ? (
                        data.map((row, index) => {
                            const isExpanded = expandedIndexes.has(index)
                            const params: iRtParams<T> = {
                                row,
                                index,
                                isMobile: true,
                                isExpanded
                            }
                            const rowExpandable = isRowExpandable(params)
                            return (
                                <Card
                                    className="hover:bg-muted/50"
                                    key={getRowKey(row, index)}
                                    {...rowPropsProvider(params)}
                                >
                                    <CardContent className="relative">
                                        {rowExpandable && (
                                            <div className="absolute top-4 right-4 flex items-center justify-center">
                                                {isExpanded ? (
                                                    <ChevronUp
                                                        size={16}
                                                        className="text-muted-foreground"
                                                    />
                                                ) : (
                                                    <ChevronDown
                                                        size={16}
                                                        className="text-muted-foreground"
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <div className="grid gap-1 sm:grid-cols-[max-content_1fr] sm:gap-4">
                                            {visibleColumns.map((col, colIndex) => {
                                                const labelClassName = col.labelClassName
                                                    ? resolvePolymorphicString(
                                                          col.labelClassName,
                                                          true
                                                      )
                                                    : ""
                                                return (
                                                    <Fragment key={colIndex}>
                                                        <div
                                                            className={cn(
                                                                "flex items-center text-xs not-first:mt-4 sm:not-first:mt-0",
                                                                labelClassName
                                                            )}
                                                        >
                                                            {resolvePolymorphicLabel(col, true)}
                                                        </div>
                                                        <div className="flex items-center">
                                                            {col.cell(params)}
                                                        </div>
                                                    </Fragment>
                                                )
                                            })}
                                        </div>
                                        {rowExpandable && isExpanded && renderExpanded && (
                                            <div className="pt-4">{renderExpanded(params)}</div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                        <div className="bg-muted/20 flex h-24 items-center justify-center rounded-lg text-sm text-muted-foreground">
                            {emptyMessage}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
