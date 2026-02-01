"use client";

import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import type { iCategory } from "../../../Category/type";
import { useSearchCategories } from "../../../Category/api";
import SearchInput from "@/Components/Entity/SearchInput/SearchInput";
import { cn } from "@/Components/Shadcn/lib/utils";

interface iProductFormSearchableSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
  selectedCategory?: iCategory | null;
}

export function ProductFormSearchableSelect({
  value,
  onChange,
  disabled,
  placeholder = "Search categories...",
  selectedCategory,
}: iProductFormSearchableSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  /** Name from last user selection; used when selectedCategory is not yet available */
  const [selectedName, setSelectedName] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: searchResults = [], isLoading } = useSearchCategories(
    debouncedSearchQuery,
    20
  );

  /** Derive display name from props/state to avoid setState in useEffect */
  const displayName =
    value === null
      ? ""
      : selectedCategory?.id === value
        ? selectedCategory.name
        : selectedName;

  const filteredResults = searchResults.filter(
    (cat) => cat.id !== undefined
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleSelect = (category: iCategory) => {
    onChange(category.id || null);
    setSelectedName(category.name);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleInputChange = (query: string) => {
    setSearchQuery(query);
    setIsOpen(true);
    if (query !== displayName) {
      setSelectedName("");
    }
  };

  const handleDebouncedChange = (query: string) => {
    setDebouncedSearchQuery(query);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (value !== null && displayName) {
      setSearchQuery("");
      setDebouncedSearchQuery("");
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <SearchInput
        value={searchQuery || displayName}
        onChange={handleInputChange}
        onDebouncedChange={handleDebouncedChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        disabled={disabled}
        debounceMs={300}
        showClearButton={value !== null}
      />

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="max-h-60 overflow-auto p-1">
            {debouncedSearchQuery.trim() === "" && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                Start typing to search...
              </div>
            )}

            {isLoading && debouncedSearchQuery.trim() !== "" && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                Searching...
              </div>
            )}

            {!isLoading &&
              debouncedSearchQuery.trim() !== "" &&
              filteredResults.length === 0 && (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No categories found
                </div>
              )}

            {!isLoading &&
              filteredResults.length > 0 &&
              filteredResults.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleSelect(category)}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    value === category.id && "bg-accent"
                  )}
                >
                  {value === category.id && (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  <span className={value === category.id ? "" : "ml-6"}>
                    {category.name}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
