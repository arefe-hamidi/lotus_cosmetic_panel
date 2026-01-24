"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LayoutDashboard } from "lucide-react";
import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";
import { cn } from "@/Components/Shadcn/lib/utils";
import { Separator } from "@/Components/Shadcn/separator";
import { useSidebar } from "./SidebarContext";
import { appRoutes } from "@/lib/routes/appRoutes";

interface iProps {
  locale: iLocale;
  onLinkClick?: () => void;
}

const navItems = [
  {
    title: "dashboard",
    href: (locale: iLocale) => appRoutes.dashboard.home(locale),
    icon: LayoutDashboard,
  },
  {
    title: "category",
    href: (locale: iLocale) => appRoutes.dashboard.category(locale),
    icon: Package,
  },
];

export default function Sidebar({ locale, onLinkClick }: iProps) {
  const dictionary = getDictionary(locale);
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        locale === "fa" ? "border-l" : "border-r"
      )}
    >
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const href = item.href(locale);
          const isActive =
            item.title === "dashboard"
              ? pathname === href || pathname === `${href}/`
              : pathname === href || pathname.startsWith(`${href}/`);
          const navKey = item.title as keyof typeof dictionary.nav;

          return (
            <Link
              key={item.title}
              href={href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isCollapsed ? "justify-center" : "",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              title={isCollapsed ? dictionary.nav[navKey] : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>{dictionary.nav[navKey]}</span>}
            </Link>
          );
        })}
      </nav>
      <Separator />
      {!isCollapsed && (
        <div className="p-4">
          <div className="text-xs text-muted-foreground">
            Lotus Cosmetic Panel
          </div>
        </div>
      )}
    </div>
  );
}
