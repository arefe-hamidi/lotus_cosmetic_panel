import { ReactNode } from "react"
import { iPolymorphicString, iResponsiveColumn, iRtParams, iRowData } from "./types"

export function resolvePolymorphicString(
    value: iPolymorphicString | undefined,
    isMobile: boolean
): string {
    if (!value) return ""
    return typeof value === "string" ? value : value(isMobile)
}

export function resolvePolymorphicLabel<T extends iRowData>(
    col: iResponsiveColumn<T> | undefined,
    isMobile: boolean
): ReactNode {
    if (!col || !col.label) return ""
    if (typeof col.label === "string") return col.label
    if (typeof col.label === "function") return col.label(isMobile)
    return col.label
}

export function getRowKey<T extends Record<string, unknown>>(
    row: T,
    index: number,
    rowKey: keyof T
): string | number {
    const key = row[rowKey]
    return typeof key === "string" ? key : index
}

export function getVisibleColumns<T extends iRowData>(
    columns: Array<iResponsiveColumn<T>>,
    isMobile: boolean
): Array<iResponsiveColumn<T>> {
    return columns.filter(col => {
        if (col.isDisable) return false
        if (isMobile && col.isMobile === false) return false
        if (!isMobile && col.isMobile === true) return false
        return true
    })
}

export function createRowParams<T extends iRowData>(
    row: T,
    index: number,
    isMobile: boolean,
    isExpanded: boolean
): iRtParams<T> {
    return { row, index, isMobile, isExpanded }
}

export function getNextSortType(currentType: string | undefined): string | undefined {
    if (!currentType || currentType === "undefined") return "asc"
    if (currentType === "asc") return "desc"
    if (currentType === "desc") return undefined
    return "asc"
}
