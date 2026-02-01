"use client";

import DashboardHeader from "./DashboardHeader/DashboardHeader";
import Sidebar from "./Sidebar/Sidebar";
import { SidebarProvider } from "./Sidebar/SidebarContext";
import type { iLocale } from "../../Entity/Locale/types";

interface iProps {
  children: React.ReactNode;
  locale: iLocale;
}

export default function DefaultLayout({ children, locale }: iProps) {
  return (
    <SidebarProvider>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
        <DashboardHeader locale={locale} />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <aside className="hidden shrink-0 border-r bg-background md:block">
            <Sidebar locale={locale} />
          </aside>
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
