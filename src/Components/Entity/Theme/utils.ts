"use client";

import type { iTheme } from "./types";

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(
  theme: iTheme,
  resolvedTheme: "light" | "dark"
): void {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    root.classList.add(resolvedTheme);
  } else {
    root.classList.add(theme);
  }
}
