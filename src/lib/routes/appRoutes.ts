import type { iLocale } from "@/Components/Entity/Locale/types";
import { tabRoute } from "./utils";

export const appRoutes = {
  auth: {
    login: (locale: iLocale) => `/${locale}/auth/login`,
    signUp: (locale: iLocale) => `/${locale}/auth/sign-up`,
    signIn: (locale: iLocale) => `/${locale}/auth/login`,
    forgotPassword: (locale: iLocale) => `/${locale}/auth/forgot-password`,
    error: (locale: iLocale) => `/${locale}/auth/error`,
    selectUserRole: (locale: iLocale) => `/${locale}/auth/select-user-role`,
  },
  dashboard: {
    home: (locale: iLocale) => `/${locale}/dashboard`,
    settings: (locale: iLocale, tab?: string) =>
      tabRoute(`/${locale}/dashboard/settings`, tab),
    category: (locale: iLocale) => `/${locale}/dashboard/category`,
  },
} as const;
