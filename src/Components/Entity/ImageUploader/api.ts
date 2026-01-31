import { errorToaster } from "@/Components/Error/ErrorHandler/utils/errorToaster"
import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch"
import { apiRoute } from "@/lib/routes/utils"

/** API response shape: { status, message, data: { path, url, name, size, ... } } */
export interface iUploadImageResponse {
    path: string
    url: string
    name?: string
    size?: number
}

export async function uploadImage(
    imageBlob: Blob,
    fileName?: string
): Promise<iUploadImageResponse | false> {
    try {
        const formData = new FormData()
        const mimeType = imageBlob.type
        const extension =
            mimeType && mimeType.includes("/") ? mimeType.split("/")[1] : "png"
        formData.append("image", imageBlob, `${fileName || "image"}.${extension}`)

        const endpoint = apiRoute("MEDIA_UPLOAD", "/")
        const response = await proxyFetch(endpoint, {
            method: "POST",
            body: formData,
        })
        if (!response.ok) throw response
        const body = await response.json()
        if (body?.status === "success" && body?.data?.path != null) {
            return {
                path: body.data.path,
                url: body.data.url ?? "",
                name: body.data.name,
                size: body.data.size,
            }
        }
        throw new Error(body?.message ?? "Upload failed")
    } catch (error) {
        await errorToaster(error)
        return false
    }
}
