import { useEffect, useState } from "react"
import { iSortIconResult } from "../types"
import { getNextSortType } from "../utils"

export interface iProps {
    sortClick?: (sortField?: string, sortType?: string) => void
    sortParam?: {
        sortField?: string
        sortType?: string
    }
}

export function useTableSort({ sortClick, sortParam }: iProps) {
    const [currentSortField, setCurrentSortField] = useState<string | undefined>(
        sortParam?.sortField
    )
    const [currentSortType, setCurrentSortType] = useState<string | undefined>(sortParam?.sortType)

    useEffect(() => {
        setCurrentSortField(sortParam?.sortField)
        setCurrentSortType(sortParam?.sortType)
    }, [sortParam?.sortField, sortParam?.sortType])

    const handleSortClick = (sortField: string) => {
        if (!sortClick) return

        let nextSortType: string | undefined
        let nextSortField: string | undefined = sortField

        if (currentSortField === sortField) nextSortType = getNextSortType(currentSortType)
        else nextSortType = "asc"

        if (nextSortType === undefined) nextSortField = undefined

        setCurrentSortField(nextSortField)
        setCurrentSortType(nextSortType)
        sortClick(nextSortField, nextSortType)
    }

    const getSortIcon = (sortField?: string): iSortIconResult => {
        if (!sortField || currentSortField !== sortField)
            return { icon: "ArrowUpDown", className: "ml-1 inline-block shrink-0 opacity-50" }
        if (currentSortType === "asc")
            return { icon: "ArrowUp", className: "ml-1 inline-block shrink-0" }
        if (currentSortType === "desc")
            return { icon: "ArrowDown", className: "ml-1 inline-block shrink-0" }
        return { icon: "ArrowUpDown", className: "ml-1 inline-block shrink-0 opacity-50" }
    }

    return {
        currentSortField,
        handleSortClick,
        getSortIcon
    }
}
