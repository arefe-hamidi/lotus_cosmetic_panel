"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/Components/Entity/Locale/constants";

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  
  // Get current locale from cookie or default
  const locale = cookieStore.get("user-locale")?.value || DEFAULT_LOCALE;
  
  redirect(`/${locale}/auth/login`);
}
