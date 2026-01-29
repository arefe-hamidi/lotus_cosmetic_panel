// Local Apps
import { IS_STAGING } from "@/lib/configs/constants"
import { NextResponse } from "next/server"
import { iconfigs } from "../types"
import { getJwtToken } from "@/lib/api/auth/utils/getJwtToken"

export async function configsHandler() {
    try {
        if (!IS_STAGING) return new Response("Invalid environment!", { status: 403 })

        const jwtToken = await getJwtToken()
        const { API_SUB_KEY, API_BASE_URL } = process.env
        const configs: iconfigs = {
            API_SUB_KEY: API_SUB_KEY ?? "",
            API_BASE_URL: API_BASE_URL ,
            jwtToken
        }

        return NextResponse.json(configs)
    } catch (error) {
        console.log(error)
        return new Response("Failed to fetch configs. See the IDE console for more details!", {
            status: 500
        })
    }
}
