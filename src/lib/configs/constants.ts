export const IS_STAGING = process.env.IS_STAGING === "true";

export const API_BASE_URL = process.env.API_BASE_URL;

export const API_SUB_KEY = process.env.API_SUB_KEY || "";

export const NEXT_PUBLIC_API_SUB_KEY = process.env.NEXT_PUBLIC_API_SUB_KEY || "";

export const NEXT_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ;

export const NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ;

export const IS_SERVER = typeof window === "undefined";
export const IS_CLIENT = typeof window !== "undefined";

/** Build full URL for a media path (e.g. "uploads/2026/01/..." -> "http://localhost:8000/media/uploads/...") */
export function getMediaUrl(path: string): string {
    if (!path) return "";
    const base = (NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
    return base ? `${base}/media/${path.replace(/^\//, "")}` : path;
}