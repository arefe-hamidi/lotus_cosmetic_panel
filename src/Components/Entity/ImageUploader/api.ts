import { errorToaster } from "@/Components/Error/ErrorHandler/utils/errorToaster"
import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch"
import { iMedia } from "@/lib/configs/types"
import { apiRoute } from "@/lib/routes/utils"

export async function uploadImage(imageBlob: Blob, fileName?: string): Promise<iMedia | false> {
    try {
        const formData = new FormData()
        const mimeType = imageBlob.type
        const extension = mimeType && mimeType.includes("/") ? mimeType.split("/")[1] : "png" // Default to "png" if type is missing or invalid
        formData.append("formFile", imageBlob, `${fileName || "image"}.${extension}`)

        const endpoint = apiRoute("MEDIA", "/single", { fileName })
        const response = await proxyFetch(endpoint, {
            method: "POST",
            body: formData
        })
        if (response.ok) return await response.json()
        throw response
    } catch (error) {
        await errorToaster(error)
        return false
    }
}
