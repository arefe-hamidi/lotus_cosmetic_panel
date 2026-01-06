"use client";

import { useState } from "react";

import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";
import Button from "@/Components/Shadcn/button";
import Input from "@/Components/Shadcn/input";
import Label from "@/Components/Shadcn/label";

interface iProps {
  locale: iLocale;
}

export default function SignUp({ locale }: iProps) {
  const dictionary = getDictionary(locale);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // TODO: Show error message
      console.error("Passwords do not match");
      return;
    }
    // TODO: Implement sign-up logic
    console.log("Sign up:", { email, password });
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
        <Label htmlFor="password">{dictionary.password}</Label>
        <Input
          id="password"
          type="password"
          placeholder={dictionary.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
        />
      </div>
      <Button type="submit" className="w-full">
        {dictionary.submit}
      </Button>
    </form>
  );
}
