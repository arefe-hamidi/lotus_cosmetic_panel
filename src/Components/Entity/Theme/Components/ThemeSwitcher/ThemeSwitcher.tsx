"use client";

import { Moon, Sun, Monitor } from "lucide-react";

import { useThemeStore } from "../../stores";
import type { iTheme } from "../../types";
import Button from "@/Components/Shadcn/button";
import { cn } from "@/Components/Shadcn/lib/utils";

interface iProps {
  className?: string;
}

export default function ThemeSwitcher({ className }: iProps) {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    const themes: iTheme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    if (theme === "light") {
      return <Sun className="h-4 w-4" />;
    }
    if (theme === "dark") {
      return <Moon className="h-4 w-4" />;
    }
    if (theme === "system") {
      return <Monitor className="h-4 w-4" />;
    }
    return <Sun className="h-4 w-4" />;
  };

  const getAriaLabel = () => {
    return `Switch to ${
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
    } theme`;
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(className)}
      aria-label={getAriaLabel()}
    >
      {getIcon()}
    </Button>
  );
}
