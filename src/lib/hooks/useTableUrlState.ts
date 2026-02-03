"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE_OPTIONS,
} from "@/Components/Entity/FullPagination/constants"

const DEFAULT_PAGE_SIZE = DEFAULT_PAGE_SIZE_OPTIONS[0] ?? 10

export interface iUseTableUrlStateParams {
  /** Current page URL path without query (e.g. `/en/dashboard/brands`) */
  basePath: string
  /** Default page size when not in URL. Defaults to first of DEFAULT_PAGE_SIZE_OPTIONS. */
  defaultPageSize?: number
  /** Allowed page size values (for validating URL). Defaults to DEFAULT_PAGE_SIZE_OPTIONS. */
  pageSizeOptions?: number[]
  /** Debounce delay for search input before updating URL, in ms. Default 300. */
  searchDebounceMs?: number
  /** Only apply search to URL/API when input has at least this many characters. Default 3. */
  minSearchLength?: number
  /** Query param names. Defaults: page, page_size, search */
  paramNames?: {
    page?: string
    pageSize?: string
    search?: string
  }
}

export interface iUseTableUrlStateResult {
  /** Current page (1-based), derived from URL */
  currentPage: number
  /** Current page size, derived from URL */
  pageSize: number
  /** Search input value (controlled). Syncs from URL on load/back-forward. */
  searchQuery: string
  /** Debounced search term for API (empty until minSearchLength chars). Use this for API calls. */
  debouncedSearch: string
  /** Update search input; URL updates after debounce (and resets to page 1). */
  setSearchQuery: (value: string) => void
  /** Call when user changes page or page size; updates URL. */
  handlePaginationChange: (page: number, pageSize: number) => void
}

const PARAM_PAGE = "page"
const PARAM_PAGE_SIZE = "page_size"
const PARAM_SEARCH = "search"

function buildTableQueryString(params: {
  page: number
  pageSize: number
  search: string
  defaultPageSize: number
  paramPage: string
  paramPageSize: string
  paramSearch: string
}): string {
  const sp = new URLSearchParams()
  if (params.page > 1) sp.set(params.paramPage, String(params.page))
  if (params.pageSize !== params.defaultPageSize) {
    sp.set(params.paramPageSize, String(params.pageSize))
  }
  if (params.search.trim()) sp.set(params.paramSearch, params.search.trim())
  const qs = sp.toString()
  return qs ? `?${qs}` : ""
}

/**
 * Syncs table list state (page, page size, search) with the URL.
 * Use for any paginated list with search so that reload and back/forward preserve state.
 *
 * @example
 * const { currentPage, pageSize, searchQuery, debouncedSearch, setSearchQuery, handlePaginationChange } =
 *   useTableUrlState({ basePath: appRoutes.dashboard.brands.root(locale) })
 */
export function useTableUrlState(
  params: iUseTableUrlStateParams
): iUseTableUrlStateResult {
  const {
    basePath,
    defaultPageSize = DEFAULT_PAGE_SIZE,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    searchDebounceMs = 300,
    minSearchLength = 3,
    paramNames = {},
  } = params

  const paramPage = paramNames.page ?? PARAM_PAGE
  const paramPageSize = paramNames.pageSize ?? PARAM_PAGE_SIZE
  const paramSearch = paramNames.search ?? PARAM_SEARCH

  const router = useRouter()
  const searchParams = useSearchParams()

  const pageParam = searchParams.get(paramPage)
  const pageSizeParam = searchParams.get(paramPageSize)
  const urlSearch = searchParams.get(paramSearch) ?? ""

  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)
  const pageSize = Math.max(
    defaultPageSize,
    pageSizeOptions.includes(Number(pageSizeParam)) ? Number(pageSizeParam) : defaultPageSize
  )

  const [searchQuery, setSearchQuery] = useState(urlSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch)

  const effectiveSearch =
    debouncedSearch.trim().length >= minSearchLength ? debouncedSearch.trim() : ""

  useEffect(() => {
    setSearchQuery(urlSearch)
    setDebouncedSearch(urlSearch)
  }, [urlSearch])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), searchDebounceMs)
    return () => clearTimeout(t)
  }, [searchQuery, searchDebounceMs])

  useEffect(() => {
    const pageForUrl =
      effectiveSearch !== urlSearch ? DEFAULT_CURRENT_PAGE : currentPage
    const desiredQuery = buildTableQueryString({
      page: pageForUrl,
      pageSize,
      search: effectiveSearch,
      defaultPageSize,
      paramPage,
      paramPageSize,
      paramSearch,
    }).replace(/^\?/, "")
    const currentQuery = searchParams.toString()
    if (currentQuery !== desiredQuery) {
      router.replace(`${basePath}${desiredQuery ? `?${desiredQuery}` : ""}`, {
        scroll: false,
      })
    }
  }, [
    currentPage,
    pageSize,
    effectiveSearch,
    urlSearch,
    basePath,
    defaultPageSize,
    paramPage,
    paramPageSize,
    paramSearch,
    router,
    searchParams,
  ])

  const handlePaginationChange = (page: number, size: number) => {
    const query = buildTableQueryString({
      page,
      pageSize: size,
      search: effectiveSearch,
      defaultPageSize,
      paramPage,
      paramPageSize,
      paramSearch,
    })
    router.replace(`${basePath}${query}`, { scroll: false })
  }

  return {
    currentPage,
    pageSize,
    searchQuery,
    debouncedSearch: effectiveSearch,
    setSearchQuery,
    handlePaginationChange,
  }
}
