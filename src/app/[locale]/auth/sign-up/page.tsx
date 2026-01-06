"use client";
import SignUp from "@/Main/Auth/SignUp/SignUp";
import { useParams } from "next/navigation";
import { DEFAULT_LOCALE } from "@/Components/Entity/Locale/constants";
import { iLocale } from "@/Components/Entity/Locale/types";
import AuthLayout from "@/Components/Layout/AuthLayout/AuthLayout";

export default function SignUpPage() {
  const params = useParams();
  const locale = (params?.locale as string) || DEFAULT_LOCALE;
  const validLocale = (
    locale === "en" || locale === "fa" ? locale : DEFAULT_LOCALE
  ) as iLocale;
  return (
    <AuthLayout locale={validLocale}>
      <SignUp locale={validLocale} />
    </AuthLayout>
  );
}
