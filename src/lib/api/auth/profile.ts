"use client";

import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch";
import { apiRoute } from "@/lib/routes/utils";
import { useQuery } from "@tanstack/react-query";

export interface iUserProfile {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar?: string;
  phone?: string;
  [key: string]: unknown;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

export function useGetProfile() {
  const endpoint = apiRoute("AUTH", "/profile/");
  const hasToken = typeof document !== "undefined" && !!getCookie("auth-token");
  
  return useQuery({
    queryKey: ["profile", endpoint],
    queryFn: async () => {
      const res = await proxyFetch(endpoint);
      if (!res.ok) throw res;
      return (await res.json()) as iUserProfile;
    },
    enabled: hasToken,
  });
}
