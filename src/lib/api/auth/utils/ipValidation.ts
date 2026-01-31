import { iUserRole } from "@/Components/Entity/Roles/types"

type UserWithIp = { ipAddress?: string;[key: string]: unknown }

/**
 * Check if user's IP is valid for the given role
 */
export function isValidIpForRole(userRole: iUserRole, user?: UserWithIp) {
    if (!user || !user.ipAddress) return false
    if (!userRole.ipRestrictionEnabled) return true
    if (!userRole.whitelistedIpAddresses || userRole.whitelistedIpAddresses.length === 0)
        return true

    const userIp = user.ipAddress.trim()
    return userRole.whitelistedIpAddresses.some((ip: string) => {
        const cleanIp = ip.trim()

        if (isIpV4(cleanIp)) return userIp === cleanIp

        if (isIpCIDR(cleanIp)) {
            const [networkIp, prefixLength] = cleanIp.split("/")
            const prefix = parseInt(prefixLength, 10)
            const mask = (0xffffffff << (32 - prefix)) >>> 0
            const userIpNum = ipToNumber(userIp)
            const networkIpNum = ipToNumber(networkIp)
            return (userIpNum & mask) === (networkIpNum & mask)
        }

        const ipRange = isIpRange(cleanIp)
        if (ipRange) {
            const userIpNum = ipToNumber(userIp)
            return userIpNum >= ipRange[0] && userIpNum <= ipRange[1]
        }
        return false
    })
}

/**
 * IPv4 single address
 * 192.168.1.1
 */
export function isIpV4(ip: string): boolean {
    const ipv4Regex =
        /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/
    return ipv4Regex.test(ip)
}

/**
 * CIDR notation
 * only standard subnet masks: /8, /16, /24, /32
 * 192.168.1.0/24
 */
export function isIpCIDR(ip: string): boolean {
    const cidrRegex =
        /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\/(8|16|24|32)$/

    return cidrRegex.test(ip)
}

/**
 * IP range
 * with optional spaces around hyphen
 * 192.168.1.1-192.168.1.254
 */
export function isIpRange(ip: string): false | [number, number] {
    const rangeRegex =
        /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\s*-\s*(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/

    if (!rangeRegex.test(ip)) return false

    const rangeParts = ip.split("-")
    const startIp = rangeParts[0].trim()
    const endIp = rangeParts[1].trim()

    if (!isIpV4(startIp) || !isIpV4(endIp)) return false

    const startNum = ipToNumber(startIp)
    const endNum = ipToNumber(endIp)
    return startNum < endNum ? [startNum, endNum] : false
}

/**
 * convert IP to number for comparison
 * 1.1.1. ----> 16843009
 */
export function ipToNumber(ip: string): number {
    const parts = ip.split(".").map(Number)
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]
}
