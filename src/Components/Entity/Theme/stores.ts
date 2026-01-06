"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { iTheme } from "./types";
import { THEME_COOKIE_NAME } from "./constants";

interface iThemeStore {
  theme: iTheme;
  setTheme: (theme: iTheme) => void;
  resolvedTheme: "light" | "dark";
  setResolvedTheme: (theme: "light" | "dark") => void;
}

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
};

export const useThemeStore = create<iThemeStore>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => {
        set({ theme });
        setCookie(THEME_COOKIE_NAME, theme);
      },
      resolvedTheme: "light",
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
    }),
    {
      name: THEME_COOKIE_NAME,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          setCookie(THEME_COOKIE_NAME, state.theme);
        }
      },
    }
  )
);

