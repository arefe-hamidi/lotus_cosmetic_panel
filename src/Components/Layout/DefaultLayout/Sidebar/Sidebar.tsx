"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LayoutDashboard, User } from "lucide-react";
import type { iLocale } from "@/Components/Entity/Locale/types";
import { getDictionary } from "./i18n";
import { cn } from "@/Components/Shadcn/lib/utils";
import { Separator } from "@/Components/Shadcn/separator";
import { useSidebar } from "./SidebarContext";
import { appRoutes } from "@/lib/routes/appRoutes";
import { useGetProfile } from "@/lib/api/auth/profile";

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
  const { data: profile, isLoading: isProfileLoading } = useGetProfile();

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
      <div className="p-4">
        {isProfileLoading ? (
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            {!isCollapsed && (
              <div className="flex-1 space-y-1">
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                <div className="h-2 w-32 animate-pulse rounded bg-muted" />
              </div>
            )}
          </div>
        ) : profile ? (
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.full_name || profile.username}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
            )}
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-medium">
                  {profile.full_name ||
                    (profile.first_name && profile.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile.username)}
                </div>
                {profile.email && (
                  <div className="truncate text-xs text-muted-foreground">
                    {profile.email}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          !isCollapsed && (
            <div className="text-xs text-muted-foreground">
              {dictionary.userInfo.notAvailable}
            </div>
          )
        )}
      </div>
    </div>
  );
}
