import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary"

const en = {
    title: "Image Cropper",
    cancel: "Cancel",
    apply: "Apply Crop",
    processing: "Processing..."
}

const fa: iDictionary = {
    title: "برش تصویر",
    cancel: "انصراف",
    apply: "اعمال برش",
    processing: "در حال پردازش..."
}

export type iDictionary = typeof en
export const getDictionary = getDictionaryGenerator<typeof en>({ en, fa })
