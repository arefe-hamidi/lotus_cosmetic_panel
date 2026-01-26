import { JWT } from "next-auth/jwt"

export type iProxyFetchOptions = Omit<RequestInit, "body"> & {
    body?: BodyInit | object
}

export type iProxyFetchOptionsWithHeader = Omit<RequestInit, "headers"> & {
    headers: Headers
}

export interface iconfigs {
    API_SUB_KEY: string | undefined
    API_BASE_URL: string | undefined
    jwtToken: JWT
}
