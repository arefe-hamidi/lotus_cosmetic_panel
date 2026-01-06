"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";
import { signUp } from "./api";
import { appRoutes } from "@/lib/routes/appRoutes";
import Button from "@/Components/Shadcn/button";
import Input from "@/Components/Shadcn/input";
import Label from "@/Components/Shadcn/label";

interface iProps {
  locale: iLocale;
}

export default function SignUp({ locale }: iProps) {
  const dictionary = getDictionary(locale);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(dictionary.passwordsMismatch);
      return;
    }

    setIsLoading(true);

    try {
      await signUp({
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        password_confirm: confirmPassword,
      });

      // Redirect to login page on success
      router.push(appRoutes.auth.login(locale));
    } catch (err) {
      if (err instanceof Response) {
        try {
          const errorData = await err.json();
          setError(errorData.message || errorData.detail || dictionary.error);
        } catch {
          setError(dictionary.error);
        }
      } else {
        setError(dictionary.error);
      }
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
        <Label htmlFor="username">{dictionary.username}</Label>
        <Input
          id="username"
          type="text"
          placeholder={dictionary.username}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{dictionary.email}</Label>
        <Input
          id="email"
          type="email"
          placeholder={dictionary.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{dictionary.firstName}</Label>
          <Input
            id="firstName"
            type="text"
            placeholder={dictionary.firstName}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{dictionary.lastName}</Label>
          <Input
            id="lastName"
            type="text"
            placeholder={dictionary.lastName}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{dictionary.password}</Label>
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
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{dictionary.confirmPassword}</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={dictionary.confirmPassword}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? dictionary.loading : dictionary.submit}
      </Button>
    </form>
  );
}
