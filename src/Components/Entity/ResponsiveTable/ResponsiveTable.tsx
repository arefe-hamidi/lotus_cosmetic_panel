"use client"

import { useMediaQuery } from "@/Components/Shadcn/lib/hooks/use-media-query"
import { useMemo, useState, useSyncExternalStore } from "react"
import DesktopView from "./Components/DesktopView"
import MobileSortButtons from "./Components/MobileSortButtons"
import MobileView from "./Components/MobileView"
import TableHeaderRow from "./Components/TableHeaderRow"
import { BREAKPOINT_PIXELS } from "./constants"
import { useTableSort } from "./hooks/useTableSort"
import { iResponsiveTableProps, iRowData } from "./types"
import { getRowKey } from "./utils"

type iProps<T extends iRowData> = iResponsiveTableProps<T>

export default function ResponsiveTable<T extends iRowData>({
    data,
    columns,
    className,
    rowKey = "id",
    rowProps,
    renderExpanded,
    isExpandable,
    isFetching,
    sortClick,
    sortParam,
    breakpoint = "lg",
    emptyMessage = "No data available"
}: iProps<T>) {
    const bp = BREAKPOINT_PIXELS[breakpoint]
    const isMobileView = useMediaQuery(`(max-width: ${bp - 1}px)`)
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    )
    const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set())

    const hasExpandableFeature = !!renderExpanded

    const { currentSortField, handleSortClick, getSortIcon } = useTableSort({
        sortClick,
        sortParam
    })

    const rowKeyProvider = useMemo(
        () => (row: T, index: number) => getRowKey(row, index, rowKey),
        [rowKey]
    )

    if (!mounted) {
        return null // Or a loading state that matches SSR
    }

    if (isMobileView) {
        const sortButtons = sortClick ? (
            <MobileSortButtons
                columns={columns}
                currentSortField={currentSortField}
                handleSortClick={handleSortClick}
                getSortIcon={getSortIcon}
            />
        ) : null

        return (
            <MobileView
                data={data}
                columns={columns}
                className={className}
                rowProps={rowProps}
                renderExpanded={renderExpanded}
                isExpandable={isExpandable}
                expandedIndexes={expandedIndexes}
                setExpandedIndexes={setExpandedIndexes}
                getRowKey={rowKeyProvider}
                isFetching={isFetching}
                sortButtons={sortButtons}
                emptyMessage={emptyMessage}
            />
        )
    }

    const headerRow = (
        <TableHeaderRow
            columns={columns}
            hasExpandableFeature={hasExpandableFeature}
            handleSortClick={handleSortClick}
            getSortIcon={getSortIcon}
        />
    )

    return (
        <DesktopView
            data={data}
            columns={columns}
            className={className}
            rowProps={rowProps}
            renderExpanded={renderExpanded}
            isExpandable={isExpandable}
            expandedIndexes={expandedIndexes}
            setExpandedIndexes={setExpandedIndexes}
            getRowKey={rowKeyProvider}
            isFetching={isFetching}
            headerRow={headerRow}
            emptyMessage={emptyMessage}
        />
    )
}
