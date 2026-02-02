"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/Components/Entity/Locale/constants";
import { refreshTokensServer } from "./refreshToken";

const AUTH_TOKEN_COOKIE = "auth-token";
const AUTH_REFRESH_COOKIE = "auth-refresh-token";
const COOKIE_MAX_AGE_DAY = 24 * 60 * 60;
const COOKIE_MAX_AGE_30_DAYS = 30 * 24 * 60 * 60;

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_COOKIE);
  cookieStore.delete(AUTH_REFRESH_COOKIE);

  const locale = cookieStore.get("user-locale")?.value || DEFAULT_LOCALE;
  redirect(`/${locale}/auth/login`);
}

/**
 * Refreshes the access token using the refresh token cookie.
 * Sets new auth-token (and optionally auth-refresh-token) cookie.
 * Call this on client when API returns 401 to retry with a fresh token.
 */
export async function refreshTokenAction(): Promise<{ success: true }> {
  const cookieStore = await cookies();
  const refreshRaw = cookieStore.get(AUTH_REFRESH_COOKIE)?.value;
  if (!refreshRaw) {
    throw new Error("No refresh token");
  }
  const refreshToken = decodeURIComponent(refreshRaw).trim();
  if (!refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const { access, refresh } = await refreshTokensServer(refreshToken);

  const maxAge = COOKIE_MAX_AGE_30_DAYS;
  cookieStore.set(AUTH_TOKEN_COOKIE, encodeURIComponent(access), {
    path: "/",
    maxAge,
    sameSite: "lax",
  });
  if (refresh) {
    cookieStore.set(AUTH_REFRESH_COOKIE, encodeURIComponent(refresh), {
      path: "/",
      maxAge,
      sameSite: "lax",
    });
  }

  return { success: true };
}
