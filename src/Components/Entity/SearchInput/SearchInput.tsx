"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Input from "@/Components/Shadcn/input";
import { cn } from "@/Components/Shadcn/lib/utils";

interface iSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  disabled?: boolean;
  debounceMs?: number;
  showClearButton?: boolean;
  className?: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchInput({
  value,
  onChange,
  onDebouncedChange,
  onFocus,
  placeholder = "Search...",
  disabled = false,
  debounceMs = 300,
  showClearButton = true,
  className,
}: iSearchInputProps) {
  const debouncedValue = useDebounce(value, debounceMs);

  useEffect(() => {
    if (onDebouncedChange) {
      onDebouncedChange(debouncedValue);
    }
  }, [debouncedValue, onDebouncedChange]);

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "pl-9",
          showClearButton && value && "pr-9",
          disabled && "cursor-not-allowed"
        )}
      />
      {showClearButton && value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
