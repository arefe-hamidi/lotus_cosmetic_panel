"use client";
import { DEFAULT_LOCALE } from "@/Components/Entity/Locale/constants";
import { iLocale } from "@/Components/Entity/Locale/types";
import AuthLayout from "@/Components/Layout/AuthLayout/AuthLayout";
import { getDictionary } from "@/Components/Layout/AuthLayout/i18n";
import Login from "@/Main/Auth/Login/Login";
import { useParams } from "next/navigation";
import Link from "next/link";
import Card, {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/Shadcn/card";

export default function LoginPage() {
  const params = useParams();
  const locale = (params?.locale as string) || DEFAULT_LOCALE;
  const validLocale = (
    locale === "en" || locale === "fa" ? locale : DEFAULT_LOCALE
  ) as iLocale;
  const dictionary = getDictionary(validLocale);

  return (
    <AuthLayout locale={validLocale}>
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.login.title}</CardTitle>
          <CardDescription>{dictionary.login.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Login locale={validLocale} />
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            {dictionary.login.noAccount}{" "}
            <Link
              href={`/${validLocale}/auth/sign-up`}
              className="font-medium text-primary hover:underline"
            >
              {dictionary.login.signUp}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
