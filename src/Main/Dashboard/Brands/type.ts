export interface iBrand {
  id?: number
  name: string
  logo?: string
  is_active?: boolean
  order?: number
  created?: string
  updated?: string
}

export interface iBrandRequest {
  name: string
  logo?: string
  is_active?: boolean
  order?: number
}

/** Form state for create brand: logo sent as file via FormData. */
export interface iBrandFormState {
  name: string
  is_active: boolean
  logoFile: Blob | null
  logoPreviewUrl: string
}

/** API wrapper for brand list: { status, data: { results } } or { status, data } */
export interface iBrandListApiResponse<T> {
  status?: string
  data?: { results?: T[]; count?: number } | T[]
}
