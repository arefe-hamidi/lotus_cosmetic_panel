import Button from "@/Components/Shadcn/button"
import { cn } from "@/Components/Shadcn/lib/utils"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem
} from "@/Components/Shadcn/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/Components/Shadcn/select"
import { iRegularParams } from "@/lib/configs/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useMemo } from "react"
import {
    BASE_ITEM_COUNT,
    DEFAULT_CURRENT_PAGE,
    DEFAULT_PAGE_SIZE_OPTIONS,
    DEFAULT_SIBLING_COUNT,
    ELLIPSIS_THRESHOLD,
    MAX_PAGES_WITHOUT_ELLIPSIS
} from "./constants"
import { getDictionary } from "./i18n"
import { range } from "./utils"

type PaginationPageItem = number | "ellipsis"

interface iProps {
    currentPage: number
    totalItems: number
    pageSize: number
    totalPages: number
    onChange: (pageNumber: number, pageSize: number) => void
    className?: string
    pageSizeOptions?: number[]
    siblingCount?: number
    boundaryCount?: number
}

export default function FullPagination({
    currentPage = DEFAULT_CURRENT_PAGE,
    totalItems,
    pageSize,
    totalPages,
    onChange,
    className,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    siblingCount = DEFAULT_SIBLING_COUNT
}: iProps) {
    useEffect(() => {
        const pageSizeNumber = Number(pageSize)
        const isValidPageSize = pageSizeOptions.includes(pageSizeNumber)
        if (!isValidPageSize) {
            const firstOption = pageSizeOptions[0]
            if (firstOption !== undefined) {
                onChange(currentPage, firstOption)
            }
        }
    }, [pageSize, pageSizeOptions, currentPage, onChange])

    const { locale } = useParams<iRegularParams>()
    const dictionary = getDictionary(locale)
    const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
    const to = Math.min(currentPage * pageSize, totalItems)

    const paginationItems = useMemo((): PaginationPageItem[] => {
        if (totalPages <= 1) {
            return [1]
        }

        if (totalPages <= MAX_PAGES_WITHOUT_ELLIPSIS) {
            return range(1, totalPages)
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

        const shouldShowLeftEllipsis = leftSiblingIndex > ELLIPSIS_THRESHOLD
        const shouldShowRightEllipsis = rightSiblingIndex < totalPages - ELLIPSIS_THRESHOLD

        const firstPageIndex = 1
        const lastPageIndex = totalPages

        if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
            const leftItemCount = BASE_ITEM_COUNT + 2 * siblingCount
            const leftRange = range(1, Math.min(leftItemCount, totalPages))
            return [...leftRange, "ellipsis", totalPages]
        }

        if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
            const rightItemCount = BASE_ITEM_COUNT + 2 * siblingCount
            const rightStart = Math.max(1, totalPages - rightItemCount + 1)
            const rightRange = range(rightStart, totalPages)
            return [firstPageIndex, "ellipsis", ...rightRange]
        }

        if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
            const middleRange = range(leftSiblingIndex, rightSiblingIndex)
            return [firstPageIndex, "ellipsis", ...middleRange, "ellipsis", lastPageIndex]
        }

        return range(1, totalPages)
    }, [totalPages, currentPage, siblingCount])

    const handlePrevious = () => {
        if (currentPage > 1) onChange(currentPage - 1, pageSize)
    }
    const handleNext = () => {
        if (currentPage < totalPages) onChange(currentPage + 1, pageSize)
    }

    return (
        <div
            className={cn(
                "text-muted-foreground mt-6 flex w-full flex-wrap items-center justify-between gap-3 text-sm lg:flex-nowrap",
                className
            )}
        >
            <div className="lg:w-3/12">
                <b>{from}</b>
                <span> {dictionary.info.to} </span>
                <b>{to}</b>
                <span> {dictionary.info.of} </span>
                <span>{totalItems}</span>
                <span> {dictionary.info.entries}</span>
            </div>
            <div className="order-3 flex w-full items-center justify-center gap-2 pt-4 lg:order-2 lg:w-6/12 lg:pt-0">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                        </PaginationItem>
                        {paginationItems.map((item, index) => {
                            if (item === "ellipsis") {
                                return (
                                    <PaginationItem key={`ellipsis-${index}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )
                            }
                            const isActive = item === currentPage
                            return (
                                <PaginationItem key={item}>
                                    <Button
                                        onClick={() => onChange(item as number, pageSize)}
                                        variant="ghost"
                                        className={cn(
                                            "text-foreground mx-1 h-8 w-auto min-w-8 cursor-pointer px-2",
                                            isActive &&
                                                "bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-primary dark:hover:bg-primary cursor-default"
                                        )}
                                    >
                                        {item}
                                    </Button>
                                </PaginationItem>
                            )
                        })}
                        <PaginationItem>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
            <div className="order-2 flex items-center justify-end gap-1 lg:order-3 lg:w-3/12">
                <span className="text-muted-foreground text-xs">{dictionary.pageSize}</span>
                <Select
                    value={String(pageSize)}
                    onValueChange={v => {
                        onChange(1, Number(v))
                    }}
                >
                    <SelectTrigger className="h-8 px-2 font-bold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                        {pageSizeOptions.map(opt => (
                            <SelectItem key={opt} value={String(opt)}>
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
