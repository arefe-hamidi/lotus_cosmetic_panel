"use client";
import SignUp from "@/Main/Auth/SignUp/SignUp";
import { useParams } from "next/navigation";
import { DEFAULT_LOCALE } from "@/Components/Entity/Locale/constants";
import { iLocale } from "@/Components/Entity/Locale/types";
import AuthLayout from "@/Components/Layout/AuthLayout/AuthLayout";
import { getDictionary } from "@/Components/Layout/AuthLayout/i18n";
import Link from "next/link";
import Card, {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/Shadcn/card";

export default function SignUpPage() {
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
          <CardTitle>{dictionary.signUp.title}</CardTitle>
          <CardDescription>{dictionary.signUp.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUp locale={validLocale} />
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            {dictionary.signUp.haveAccount}{" "}
            <Link
              href={`/${validLocale}/auth/login`}
              className="font-medium text-primary hover:underline"
            >
              {dictionary.signUp.login}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
