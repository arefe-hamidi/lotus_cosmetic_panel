import { errorToaster } from "@/Components/Error/ErrorHandler/utils/errorToaster"
import { proxyFetch } from "../api/proxyFetch/proxyFetch"
import { apiRoute } from "../routes/utils"
import { iMedia } from "./types"

export async function uploadDocFile(file: File, fileName?: string): Promise<iMedia | false> {
    try {
        const formData = new FormData()
        formData.append("formFile", file)
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
