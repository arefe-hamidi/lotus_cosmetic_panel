import { getDictionaryGenerator } from "@/Components/Entity/Locale/utils"

const en = {
    title: "Image Cropper"
}

const de: iDictionary = {
    title: "Bild Zuschneider"
}

export type iDictionary = typeof en
export const getDictionary = getDictionaryGenerator<typeof en>({ en, de })
