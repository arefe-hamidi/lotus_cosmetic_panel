export const IS_STAGING = process.env.IS_STAGING === "true";

export const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

export const API_SUB_KEY = process.env.API_SUB_KEY || "";

export const NEXT_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:8000";
export const IS_SERVER = typeof window === "undefined"
export const IS_CLIENT = typeof window !== "undefined"