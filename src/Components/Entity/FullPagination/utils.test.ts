import { describe, expect, it } from "vitest"
import { range } from "./utils"

describe("range", () => {
    it("creates an inclusive range", () => {
        expect(range(3, 7)).toEqual([3, 4, 5, 6, 7])
    })

    it("handles start equal to end", () => {
        expect(range(5, 5)).toEqual([5])
    })
})
