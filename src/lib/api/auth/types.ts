import { iPagination } from "../../configs/types"

export interface iRefreshTokenResponse {
    id_token: string
    refresh_token?: string
    expires_at: number
}

export interface iRoles extends iPagination {
    items: Array<{ id: string; [key: string]: unknown }>
}

export interface iUserAccount {
    id?: number
    username?: string
    email?: string
    first_name?: string
    last_name?: string
    full_name?: string
    avatar?: string
    phone?: string
    ipAddress?: string
    activeUserRoleId?: string | null
    roles?: Array<{ id: string; [key: string]: unknown }>
    [key: string]: unknown
}

export type iResponses = [iRoles, iUserAccount]
