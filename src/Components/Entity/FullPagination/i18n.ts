import { getDictionaryGenerator } from "@/Components/Entity/Locale/utils"

const en = {
    pageSize: "Rows per page",
    info: {
        to: "to",
        of: "of",
        entries: "entries"
    }
}

const de: iDictionary = {
    pageSize: "Zeilen pro Seite",
    info: {
        to: "bis",
        of: "von",
        entries: "Einträgen"
    }
}

export type iDictionary = typeof en
export const getDictionary = getDictionaryGenerator<typeof en>({ en, de })
