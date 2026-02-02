"use server";

import { API_BASE_URL, API_SUB_KEY } from "@/lib/configs/constants";
import { apiRoute } from "@/lib/routes/utils";

export interface iRefreshResponse {
  access: string;
  refresh?: string;
}

/**
 * Calls backend refresh endpoint and returns new tokens.
 * Used by server action and proxyHandler when access token is expired.
 */
export async function refreshTokensServer(refreshToken: string): Promise<iRefreshResponse> {
  const endpoint = apiRoute("AUTH", "/token/refresh/");
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (API_SUB_KEY) {
    headers["ocp-apim-subscription-key"] = API_SUB_KEY;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token refresh failed: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as { access?: string; access_token?: string; refresh?: string; refresh_token?: string };
  const access = data.access ?? data.access_token ?? "";
  const refresh = data.refresh ?? data.refresh_token;

  if (!access) {
    throw new Error("Refresh response missing access token");
  }

  return { access, refresh };
}
