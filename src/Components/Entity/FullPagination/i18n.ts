import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary"

const en = {
    pageSize: "Rows per page",
    info: {
        to: "to",
        of: "of",
        entries: "entries"
    }
}

const fa: iDictionary = {
    pageSize: "ردیف برای هر صفحه",
    info: {
        to: "تا",
        of: "از",
        entries: "ردیف"
    }
}

export type iDictionary = typeof en
export const getDictionary = getDictionaryGenerator<typeof en>({ en, fa })
