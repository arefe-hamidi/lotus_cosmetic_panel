import type { ReactNode } from "react"
import { describe, expect, it } from "vitest"
import type { iResponsiveColumn, iRowData } from "./types"
import {
    createRowParams,
    getNextSortType,
    getRowKey,
    getVisibleColumns,
    resolvePolymorphicLabel,
    resolvePolymorphicString
} from "./utils"

describe("ResponsiveTable utils", () => {
    it("resolves polymorphic string value", () => {
        expect(resolvePolymorphicString("text", true)).toBe("text")
        expect(resolvePolymorphicString(v => (v ? "m" : "d"), true)).toBe("m")
        expect(resolvePolymorphicString(undefined, false)).toBe("")
    })

    it("resolves polymorphic label", () => {
        const col1: iResponsiveColumn<iRowData> = { label: "Name" }
        const col2: iResponsiveColumn<iRowData> = {
            label: (isMobile: boolean) => (isMobile ? "M" : "D")
        }
        const col3: iResponsiveColumn<iRowData> = { label: 123 as unknown as ReactNode }
        expect(resolvePolymorphicLabel(col1, true)).toBe("Name")
        expect(resolvePolymorphicLabel(col2, true)).toBe("M")
        expect(resolvePolymorphicLabel(col3, false)).toBe(123)
        expect(resolvePolymorphicLabel(undefined, false)).toBe("")
    })

    it("gets row key string or falls back to index", () => {
        const row: Record<string, unknown> & { id: string } = { id: "abc", index: 42 }
        expect(getRowKey(row, 0, "id")).toBe("abc")
        expect(getRowKey({ id: 10 } as Record<string, unknown>, 7, "id")).toBe(7)
    })

    it("filters visible columns based on mobile flags", () => {
        const columns: Array<iResponsiveColumn<iRowData>> = [
            { label: "A" },
            { label: "B", isDisable: true },
            { label: "C", isMobile: false },
            { label: "D", isMobile: true }
        ]
        const mobile = getVisibleColumns(columns, true).map(c => c.label as string)
        const desktop = getVisibleColumns(columns, false).map(c => c.label as string)
        expect(mobile).toEqual(["A", "D"])
        expect(desktop).toEqual(["A", "C"])
    })

    it("creates row params object", () => {
        const params = createRowParams({ id: 1 } as iRowData, 0, true, false)
        expect(params).toEqual({ row: { id: 1 }, index: 0, isMobile: true, isExpanded: false })
    })

    it("cycles sort type correctly", () => {
        expect(getNextSortType(undefined)).toBe("asc")
        expect(getNextSortType("asc")).toBe("desc")
        expect(getNextSortType("desc")).toBeUndefined()
        expect(getNextSortType("undefined")).toBe("asc")
    })
})
