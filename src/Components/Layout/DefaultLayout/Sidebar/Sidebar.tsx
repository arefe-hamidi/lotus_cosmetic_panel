"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, LayoutDashboard, User, ShoppingBag, Building2 } from "lucide-react"
import type { iLocale } from "@/Components/Entity/Locale/types"
import { getDictionary } from "./i18n"
import { cn } from "@/Components/Shadcn/lib/utils"
import { Separator } from "@/Components/Shadcn/separator"
import Skeleton from "@/Components/Shadcn/skeleton"
import { useSidebar } from "./SidebarContext"
import { appRoutes } from "@/lib/routes/appRoutes"
import { useGetProfile } from "@/lib/api/auth/profile"

interface iProps {
  locale: iLocale
  onLinkClick?: () => void
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
  {
    title: "products",
    href: (locale: iLocale) => appRoutes.dashboard.products.root(locale),
    icon: ShoppingBag,
  },
  {
    title: "brands",
    href: (locale: iLocale) => appRoutes.dashboard.brands.root(locale),
    icon: Building2,
  },
]

export default function Sidebar({ locale, onLinkClick }: iProps) {
  const dictionary = getDictionary(locale)
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()
  const { data: profile, isLoading: isProfileLoading } = useGetProfile()

  return (
    <div
      className={cn(
        "bg-background flex h-full flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        locale === "fa" ? "border-l" : "border-r"
      )}
    >
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const href = item.href(locale)
          const isActive =
            item.title === "dashboard"
              ? pathname === href || pathname === `${href}/`
              : pathname === href || pathname.startsWith(`${href}/`)
          const navKey = item.title as keyof typeof dictionary.nav

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
          )
        })}
      </nav>
      <Separator />
      <div className="p-4">
        {isProfileLoading ? (
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            <Skeleton className="h-8 w-8 rounded-full" />
            {!isCollapsed && (
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2 w-32" />
              </div>
            )}
          </div>
        ) : profile ? (
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.full_name || profile.username || "User"}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
                <User className="h-4 w-4" />
              </div>
            )}
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  {profile.full_name ||
                    (profile.first_name && profile.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile.username || "User")}
                </div>
                {profile.email && (
                  <div className="text-muted-foreground truncate text-xs">{profile.email}</div>
                )}
                {profile.roles && profile.roles.length > 0 && (
                  <div className="text-muted-foreground mt-0.5 truncate text-xs">
                    {profile.roles.length} {profile.roles.length === 1 ? "role" : "roles"}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          !isCollapsed && (
            <div className="text-muted-foreground text-xs">{dictionary.userInfo.notAvailable}</div>
          )
        )}
      </div>
    </div>
  )
}
