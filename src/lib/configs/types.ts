import { iLocale } from "@/Components/Entity/Locale/types"
import { DefaultTooltipContentProps } from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

export interface iAuditInfo {
    createdBy: string
    createdAt: string
    updatedBy: string | null
    updatedAt: string | null
}

export interface iPagination {
    pageNumber: number
    pageSize: number
    totalItems: number
    totalPages: number
}

export interface iAddress {
    name?: string | null
    countryName?: string | null
    countryIso2?: string | null
    countryIso3?: string | null
    state?: string | null
    city?: string | null
    postalCode?: string | null
    street?: string | null
    houseNumber?: string | null
    location?: iLocation | null
}

export interface iLocation {
    longitude: number
    latitude: number
}

export interface iMedia {
    absoluteUri: string
    thumbnailUrl: string
    mimeType: string
    metaData: {
        OriginalFileSize: string
        StoredHeight: string
        StoredWidth: string
        OriginalHeight: string
        OriginalWidth: string
        HorizontalResolution: string
        VerticalResolution: string
        ActualSize: string
    }
}

export type iChartTooltipContentProps = DefaultTooltipContentProps<ValueType, NameType>

export type iPageRouteHandler = (term?: string, page?: number, pageSize?: number) => string

export interface iRegularParams {
    locale: iLocale
    [key: string]: string
}
