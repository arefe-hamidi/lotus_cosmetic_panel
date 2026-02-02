"use client";

const AUTH_TOKEN_COOKIE = "auth-token";
const AUTH_REFRESH_COOKIE = "auth-refresh-token";

function getCookieMaxAge(rememberMe: boolean): number {
  return rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
}

export function setAuthToken(token: string, rememberMe: boolean = false) {
  if (typeof document === "undefined") {
    console.warn("[setAuthToken] document is undefined, cannot set cookie");
    return;
  }

  if (!token || token.trim().length === 0) {
    console.error("[setAuthToken] ❌ Token is empty or undefined:", token);
    return;
  }

  const maxAge = getCookieMaxAge(rememberMe);
  const encodedToken = encodeURIComponent(token);
  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodedToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function setRefreshToken(refreshToken: string, rememberMe: boolean = false) {
  if (typeof document === "undefined") return;
  if (!refreshToken || refreshToken.trim().length === 0) return;
  const maxAge = getCookieMaxAge(rememberMe);
  const encoded = encodeURIComponent(refreshToken);
  document.cookie = `${AUTH_REFRESH_COOKIE}=${encoded}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function removeAuthToken() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function removeRefreshToken() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_REFRESH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function removeAllAuthCookies() {
  removeAuthToken();
  removeRefreshToken();
}
