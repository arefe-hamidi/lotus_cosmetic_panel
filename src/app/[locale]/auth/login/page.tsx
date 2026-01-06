"use client";
import { DEFAULT_LOCALE } from "@/Components/Entity/Locale/constants";
import { iLocale } from "@/Components/Entity/Locale/types";
import AuthLayout from "@/Components/Layout/AuthLayout/AuthLayout";
import Login from "@/Main/Auth/Login/Login";
import { useParams } from "next/navigation";

export default function LoginPage() {
  const params = useParams();
  const locale = (params?.locale as string) || DEFAULT_LOCALE;
  const validLocale = (
    locale === "en" || locale === "fa" ? locale : DEFAULT_LOCALE
  ) as iLocale;
  return (
    <AuthLayout locale={validLocale}>
      <Login locale={validLocale} />
    </AuthLayout>
  );
}
