"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Check } from "lucide-react"
import type { iBrand } from "../../../Brands/type"
import { useGetBrands } from "../../../Brands/api"
import SearchInput from "@/Components/Entity/SearchInput/SearchInput"
import { cn } from "@/Components/Shadcn/lib/utils"

interface iProductFormBrandSelectProps {
  value: number | null
  onChange: (value: number | null) => void
  disabled?: boolean
  placeholder?: string
  selectedBrand?: iBrand | null
}

export function ProductFormBrandSelect({
  value,
  onChange,
  disabled,
  placeholder = "Search brands...",
  selectedBrand,
}: iProductFormBrandSelectProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedName, setSelectedName] = useState<string>("")
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: brands = [], isLoading } = useGetBrands()

  const displayName =
    value === null || value === 0
      ? ""
      : selectedBrand?.id === value
        ? selectedBrand.name
        : selectedName

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands
    const q = searchQuery.trim().toLowerCase()
    return brands.filter((b) => b.name?.toLowerCase().includes(q))
  }, [brands, searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (brand: iBrand) => {
    onChange(brand.id ?? null)
    setSelectedName(brand.name ?? "")
    setSearchQuery("")
    setIsOpen(false)
  }

  const handleInputChange = (query: string) => {
    setSearchQuery(query)
    setIsOpen(true)
    if (query !== displayName) setSelectedName("")
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  return (
    <div ref={containerRef} className="relative">
      <SearchInput
        value={searchQuery || displayName}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        disabled={disabled}
        debounceMs={0}
        showClearButton={value !== null && value !== 0}
      />

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="max-h-60 overflow-auto p-1">
            {searchQuery.trim() === "" && filteredBrands.length === 0 && !isLoading && (
              <div className="text-muted-foreground px-2 py-1.5 text-sm">
                Start typing to search...
              </div>
            )}

            {isLoading && (
              <div className="text-muted-foreground px-2 py-1.5 text-sm">
                Loading...
              </div>
            )}

            {!isLoading && searchQuery.trim() !== "" && filteredBrands.length === 0 && (
              <div className="text-muted-foreground px-2 py-1.5 text-sm">
                No brands found
              </div>
            )}

            {!isLoading &&
              filteredBrands.length > 0 &&
              filteredBrands.map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => handleSelect(brand)}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    value === brand.id && "bg-accent"
                  )}
                >
                  {value === brand.id && <Check className="mr-2 h-4 w-4" />}
                  <span className={value === brand.id ? "" : "ml-6"}>
                    {brand.name}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
