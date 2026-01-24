import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { iSortIconResult } from "../types"

interface iProps {
    icon: iSortIconResult["icon"]
    className: string
}

export default function SortIcon({ icon, className }: iProps) {
    switch (icon) {
        case "ArrowUp":
            return <ArrowUp size={14} className={className} />
        case "ArrowDown":
            return <ArrowDown size={14} className={className} />
        default:
            return <ArrowUpDown size={14} className={className} />
    }
}
