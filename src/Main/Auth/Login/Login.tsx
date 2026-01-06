"use client";

import { useState } from "react";
import Link from "next/link";

import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";
import Button from "@/Components/Shadcn/button";
import Input from "@/Components/Shadcn/input";
import Label from "@/Components/Shadcn/label";

interface iProps {
  locale: iLocale;
}

export default function Login({ locale }: iProps) {
  const dictionary = getDictionary(locale);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login:", { email, password, rememberMe });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{dictionary.email}</Label>
        <Input
          id="email"
          type="email"
          placeholder={dictionary.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          id="remember"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="remember" className="text-sm font-normal">
          {dictionary.rememberMe}
        </Label>
      </div>
      <Button type="submit" className="w-full">
        {dictionary.submit}
      </Button>
    </form>
  );
}
