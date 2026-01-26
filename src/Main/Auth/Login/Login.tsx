"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";
import { login } from "./api";
import { appRoutes } from "@/lib/routes/appRoutes";
import { setAuthToken } from "@/lib/api/auth/utils";
import Button from "@/Components/Shadcn/button";
import Input from "@/Components/Shadcn/input";
import Label from "@/Components/Shadcn/label";

interface iProps {
  locale: iLocale;
}

export default function Login({ locale }: iProps) {
  const dictionary = getDictionary(locale);
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await login({
        username_or_email: identifier,
        password,
      });

      // Debug logging
      console.log("[Login Component] Response:", {
        hasAccess: !!response.access,
        accessValue: response.access ? `${response.access.substring(0, 20)}...` : "undefined",
        rememberMe,
      });

      // Set the auth token cookie
      if (!response.access) {
        console.error("[Login Component] ❌ Access token is undefined!");
        throw new Error("Login failed: No access token received");
      }

      setAuthToken(response.access, rememberMe);
      
      // Verify cookie was set
      const cookieValue = document.cookie
        .split("; ")
        .find(row => row.startsWith("auth-token="))
        ?.split("=")[1];
      console.log("[Login Component] Cookie set:", {
        found: !!cookieValue,
        length: cookieValue?.length || 0,
      });

      // Redirect to dashboard on success
      toast.success(dictionary.success || "Login successful");
      router.push(appRoutes.dashboard.home(locale));
    } catch (err) {
      let message = dictionary.error;
      if (err instanceof Response) {
        try {
          const errorData = await err.json();
          message = errorData.message || errorData.detail || dictionary.error;
        } catch {
          message = dictionary.error;
        }
      }
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="identifier">{dictionary.identifier}</Label>
        <Input
          id="identifier"
          type="text"
          placeholder={dictionary.identifier}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{dictionary.password}</Label>
          <Link
            href={`/${locale}/auth/forgot-password`}
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            {dictionary.forgotPassword}
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder={dictionary.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          id="remember"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
          disabled={isLoading}
        />
        <Label htmlFor="remember" className="text-sm font-normal">
          {dictionary.rememberMe}
        </Label>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? dictionary.loading : dictionary.submit}
      </Button>
    </form>
  );
}
