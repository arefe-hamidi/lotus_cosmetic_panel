"use server"

/**
 * Decodes a JWT token to extract its payload
 * returns The decoded payload or null if invalid
 */
export async function decodeJwtToken(token: string) {
    try {
        const parts = token.split(".")
        if (parts.length !== 3) throw new Error("Invalid JWT token format")

        const payload = parts[1]
        const decoded = JSON.parse(atob(payload))
        return decoded
    } catch (error) {
        console.error("Failed to decode JWT token:", error)
        return null
    }
}
