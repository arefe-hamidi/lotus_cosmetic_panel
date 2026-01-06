"use client";

import { useEffect } from "react";

import { useThemeStore } from "../stores";
import { getSystemTheme, applyTheme } from "../utils";

export default function ThemeInit() {
  const { theme, resolvedTheme, setResolvedTheme } = useThemeStore();

  useEffect(() => {
    const systemTheme = getSystemTheme();
    setResolvedTheme(systemTheme);

    const currentResolvedTheme = theme === "system" ? systemTheme : theme;
    applyTheme(theme, currentResolvedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? "dark" : "light";
      setResolvedTheme(newSystemTheme);

      if (theme === "system") {
        applyTheme("system", newSystemTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme, setResolvedTheme]);

  useEffect(() => {
    const currentResolvedTheme = theme === "system" ? resolvedTheme : theme;
    applyTheme(theme, currentResolvedTheme);
  }, [theme, resolvedTheme]);

  return null;
}

