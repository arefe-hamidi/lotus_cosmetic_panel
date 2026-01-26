import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch";
import { apiRoute } from "@/lib/routes/utils";
import type { iLoginRequest, iLoginResponse } from "./type";

export async function login(data: iLoginRequest): Promise<iLoginResponse> {
  const endpoint = apiRoute("AUTH", "/login/");
  const response = await proxyFetch(endpoint, {
    method: "POST",
    body: data,
  });

  if (!response.ok) {
    throw response;
  }

  const rawResponse = await response.json();
  
  // Debug logging - log the raw response first
  console.log("[Login API] Raw response:", rawResponse);
  console.log("[Login API] Response keys:", Object.keys(rawResponse));
  
  // Handle different response formats
  // Backend returns tokens nested in a 'tokens' object
  const tokens = rawResponse.tokens || rawResponse;
  const responseData: iLoginResponse = {
    access: tokens.access || tokens.access_token || rawResponse.access || rawResponse.access_token || rawResponse.token,
    refresh: tokens.refresh || tokens.refresh_token || rawResponse.refresh || rawResponse.refresh_token,
    user: rawResponse.user || rawResponse.user_data || {},
  } as iLoginResponse;
  
  // Debug logging
  console.log("[Login API] Processed response:", {
    hasAccess: !!responseData.access,
    accessLength: responseData.access?.length || 0,
    hasRefresh: !!responseData.refresh,
    hasUser: !!responseData.user,
    tokensObject: !!rawResponse.tokens,
  });

  if (!responseData.access) {
    console.error("[Login API] ❌ No access token in response. Raw response:", rawResponse);
    throw new Error("Login response missing access token");
  }

  return responseData;
}
