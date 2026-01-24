"use client";

import { Menu, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";

import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";
import { getTextDirection } from "@/Components/Entity/Locale/direction";
import LanguageSwitcher from "@/Components/Entity/Locale/LanguageSwitcher";
import ThemeSwitcher from "@/Components/Entity/Theme/Components/ThemeSwitcher/ThemeSwitcher";
import Button from "@/Components/Shadcn/button";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/Shadcn/sheet";
import { cn } from "@/Components/Shadcn/lib/utils";
import Sidebar from "../Sidebar/Sidebar";
import { useSidebar } from "../Sidebar/SidebarContext";
import { logoutAction } from "@/lib/api/auth/actions";

interface iProps {
  locale: iLocale;
}

export default function DashboardHeader({ locale }: iProps) {
  const dictionary = getDictionary(locale);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar();
  const direction = getTextDirection(locale);
  const isRTL = direction === "rtl";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side={isRTL ? "right" : "left"} className="w-64 p-0">
            <Sidebar
              locale={locale}
              onLinkClick={() => setSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden md:flex"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className={cn("h-5 w-5", isRTL && "rotate-180")} />
          ) : (
            <ChevronLeft className={cn("h-5 w-5", isRTL && "rotate-180")} />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{dictionary.logo}</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher appearance="select" />
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logoutAction()}
            title={dictionary.logout}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">{dictionary.logout}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
