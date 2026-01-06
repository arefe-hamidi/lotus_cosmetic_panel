import { API_BASE_PATH, TAB_KEY } from "./constants";
import type { iSearchParams } from "./types";

export function apiRoute(
  apiBasePathKey: keyof typeof API_BASE_PATH,
  path: string,
  params?: iSearchParams
): string {
  const basePath = API_BASE_PATH[apiBasePathKey];
  const fullPath = `${basePath}${path}`;

  if (!params || Object.keys(params).length === 0) {
    return fullPath;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${fullPath}?${queryString}` : fullPath;
}

export function tabRoute(pageRoute: string, tab?: string): string {
  if (!tab) return pageRoute;
  return `${pageRoute}?${TAB_KEY}=${tab}`;
}

export function buildRoute(path: string, params?: iSearchParams): string {
  if (!params || Object.keys(params).length === 0) {
    return path;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}
