import type { User } from "next-auth"
import { describe, expect, it } from "vitest"
import type { iUserRole } from "../../../Components/Entity/Roles/types"
import { ipToNumber, isIpCIDR, isIpRange, isIpV4, isValidIpForRole } from "./ipValidation"

type UserWithIp = User & {
    ipAddress?: string
}

describe("isIpV4", () => {
    it("should return true for valid IPv4 addresses", () => {
        expect(isIpV4("192.168.1.1")).toBe(true)
        expect(isIpV4("10.0.0.1")).toBe(true)
        expect(isIpV4("172.16.0.1")).toBe(true)
        expect(isIpV4("255.255.255.255")).toBe(true)
        expect(isIpV4("0.0.0.0")).toBe(true)
    })

    it("should return false for invalid IPv4 addresses", () => {
        expect(isIpV4("256.1.1.1")).toBe(false)
        expect(isIpV4("192.168.1")).toBe(false)
        expect(isIpV4("192.168.1.1.1")).toBe(false)
        expect(isIpV4("invalid")).toBe(false)
        expect(isIpV4("192.168.1.-1")).toBe(false)
        expect(isIpV4("")).toBe(false)
    })
})

describe("isIpCIDR", () => {
    it("should return true for valid CIDR notation", () => {
        expect(isIpCIDR("192.168.1.0/24")).toBe(true)
        expect(isIpCIDR("10.0.0.0/8")).toBe(true)
        expect(isIpCIDR("172.16.0.0/16")).toBe(true)
        expect(isIpCIDR("192.168.1.1/32")).toBe(true)
    })

    it("should return false for invalid CIDR notation", () => {
        expect(isIpCIDR("192.168.1.0/33")).toBe(false)
        expect(isIpCIDR("192.168.1.0/7")).toBe(false)
        expect(isIpCIDR("192.168.1.0/25")).toBe(false)
        expect(isIpCIDR("192.168.1.0")).toBe(false)
        expect(isIpCIDR("invalid")).toBe(false)
        expect(isIpCIDR("192.168.1.0/24/extra")).toBe(false)
    })
})

describe("isIpRange", () => {
    it("should return array for valid IP range", () => {
        const result = isIpRange("192.168.1.1-192.168.1.254")
        // JavaScript bitwise operations return signed 32-bit integers
        expect(result).toEqual([-1062731519, -1062731266])
    })

    it("should return array for IP range with spaces", () => {
        const result = isIpRange("192.168.1.1 - 192.168.1.254")
        // JavaScript bitwise operations return signed 32-bit integers
        expect(result).toEqual([-1062731519, -1062731266])
    })

    it("should return false for invalid IP range", () => {
        expect(isIpRange("192.168.1.254-192.168.1.1")).toBe(false)
        expect(isIpRange("192.168.1.1-192.168.1.1")).toBe(false)
        expect(isIpRange("invalid-range")).toBe(false)
        expect(isIpRange("192.168.1.1")).toBe(false)
        expect(isIpRange("192.168.1.1-256.1.1.1")).toBe(false)
    })

    it("should return false for range with invalid start IP", () => {
        expect(isIpRange("256.1.1.1-192.168.1.254")).toBe(false)
    })

    it("should return false for range with invalid end IP", () => {
        expect(isIpRange("192.168.1.1-256.1.1.1")).toBe(false)
    })
})

describe("ipToNumber", () => {
    it("should convert IPv4 to number correctly", () => {
        expect(ipToNumber("0.0.0.0")).toBe(0)
        expect(ipToNumber("0.0.0.1")).toBe(1)
        expect(ipToNumber("1.1.1.1")).toBe(16843009)
        // JavaScript bitwise operations return signed 32-bit integers
        // 192.168.1.1 as signed: -1062731519, as unsigned: 3232235777
        expect(ipToNumber("192.168.1.1")).toBe(-1062731519)
        // 255.255.255.255 as signed: -1, as unsigned: 4294967295
        expect(ipToNumber("255.255.255.255")).toBe(-1)
    })

    it("should handle edge cases", () => {
        expect(ipToNumber("127.0.0.1")).toBe(2130706433)
        expect(ipToNumber("10.0.0.1")).toBe(167772161)
    })
})

describe("isValidIpForRole", () => {
    const mockUser = {
        id: "user1",
        email: "test@example.com",
        name: "Test User",
        ipAddress: "192.168.1.100",
        roles: []
    } as UserWithIp

    it("should return true when IP restriction is disabled", () => {
        const role: iUserRole = {
            id: "role1",
            name: "Test Role",
            ipRestrictionEnabled: false,
            whitelistedIpAddresses: []
        }

        expect(isValidIpForRole(role, mockUser)).toBe(true)
    })

    it("should return false when user has no IP address", () => {
        const role: iUserRole = {
            id: "role1",
            name: "Test Role",
            ipRestrictionEnabled: true,
            whitelistedIpAddresses: ["192.168.1.100"]
        }

        const userWithoutIp = { ...mockUser, ipAddress: undefined }
        expect(isValidIpForRole(role, userWithoutIp)).toBe(false)
    })

    it("should return false when user is not provided", () => {
        const role: iUserRole = {
            id: "role1",
            name: "Test Role",
            ipRestrictionEnabled: true,
            whitelistedIpAddresses: ["192.168.1.100"]
        }

        expect(isValidIpForRole(role, undefined)).toBe(false)
    })

    it("should return true when whitelist is empty", () => {
        const role: iUserRole = {
            id: "role1",
            name: "Test Role",
            ipRestrictionEnabled: true,
            whitelistedIpAddresses: []
        }

        expect(isValidIpForRole(role, mockUser)).toBe(true)
    })

    it("should return true for exact IP match", () => {
        const role: iUserRole = {
            id: "role1",
            name: "Test Role",
            ipRestrictionEnabled: true,
            whitelistedIpAddresses: ["192.168.1.100"]
        }

        expect(isValidIpForRole(role, mockUser)).toBe(true)
    })

    it("should return false when IP does not match", () => {
        const role: iUserRole = {
            id: "role1",
            name: "Test Role",
            ipRestrictionEnabled: true,
            whitelistedIpAddresses: ["10.0.0.1"]
        }

        expect(isValidIpForRole(role, mockUser)).toBe(false)
    })

    it("should handle CIDR notation", () => {
        const role: iUserRole = {
            id: "role1",
            name: "Test Role",
            ipRestrictionEnabled: true,
            whitelistedIpAddresses: ["192.168.1.0/24"]
        }

        expect(isValidIpForRole(role, mockUser)).toBe(true)
    })

    it("should handle IP range", () => {
        const role: iUserRole = {
            id: "role1",
            name: "Test Role",
            ipRestrictionEnabled: true,
            whitelistedIpAddresses: ["192.168.1.1-192.168.1.200"]
        }

        expect(isValidIpForRole(role, mockUser)).toBe(true)
    })

    it("should handle IP range with spaces", () => {
        const role: iUserRole = {
            id: "role1",
            name: "Test Role",
            ipRestrictionEnabled: true,
            whitelistedIpAddresses: ["192.168.1.1 - 192.168.1.200"]
        }

        expect(isValidIpForRole(role, mockUser)).toBe(true)
    })

    it("should return true if any IP in whitelist matches", () => {
        const role: iUserRole = {
            id: "role1",
            name: "Test Role",
            ipRestrictionEnabled: true,
            whitelistedIpAddresses: ["10.0.0.1", "192.168.1.100", "172.16.0.1"]
        }

        expect(isValidIpForRole(role, mockUser)).toBe(true)
    })

    it("should handle IPs with whitespace", () => {
        const role: iUserRole = {
            id: "role1",
            name: "Test Role",
            ipRestrictionEnabled: true,
            whitelistedIpAddresses: [" 192.168.1.100 "]
        }

        expect(isValidIpForRole(role, mockUser)).toBe(true)
    })

    it("should handle user IP with whitespace", () => {
        const userWithWhitespace = {
            ...mockUser,
            ipAddress: " 192.168.1.100 "
        } as UserWithIp

        const role: iUserRole = {
            id: "role1",
            name: "Test Role",
            ipRestrictionEnabled: true,
            whitelistedIpAddresses: ["192.168.1.100"]
        }

        expect(isValidIpForRole(role, userWithWhitespace)).toBe(true)
    })
})
