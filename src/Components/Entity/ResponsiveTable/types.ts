import { HTMLAttributes, ReactNode } from "react"
export interface iRowData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

export interface iRtParams<TData> {
    row: TData
    index: number
    isMobile: boolean
    isExpanded: boolean
}

export type iBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl" | "4xl"

export type iPolymorphicString = string | ((isMobile: boolean) => string)
export type iPolymorphicLabel =
    | string
    | ((isMobile: boolean) => string)
    | ReactNode
    | ((isMobile: boolean) => ReactNode)

export interface iResponsiveColumn<T extends iRowData> {
    label: iPolymorphicLabel
    isMobile?: boolean
    labelClassName?: iPolymorphicString
    cell: (params: iRtParams<T>) => ReactNode
    sortField?: string
    isDisable?: boolean
    /** Keep column visible when table scrolls horizontally (e.g. actions column) */
    stickyRight?: boolean
}

export interface iResponsiveTableProps<T extends iRowData> {
    data: Array<T>
    columns: Array<iResponsiveColumn<T>>
    breakpoint?: iBreakpoint
    className?: iPolymorphicString
    rowKey?: keyof T
    isFetching?: boolean
    rowProps?: (params: iRtParams<T>) => HTMLAttributes<HTMLTableRowElement>
    renderExpanded?: (params: iRtParams<T>) => ReactNode
    isExpandable?: (params: iRtParams<T>) => boolean
    sortClick?: (SortField?: string, SortType?: string) => void
    sortParam?: {
        sortField?: string
        sortType?: string
    }
    emptyMessage?: string
}

export type iSortIconResult = {
    icon: "ArrowUp" | "ArrowDown" | "ArrowUpDown"
    className: string
}
