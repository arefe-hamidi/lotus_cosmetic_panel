"use client";

export function setAuthToken(token: string, rememberMe: boolean = false) {
  if (typeof document === "undefined") return;

  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
  document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function removeAuthToken() {
  if (typeof document === "undefined") return;
  document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
}
