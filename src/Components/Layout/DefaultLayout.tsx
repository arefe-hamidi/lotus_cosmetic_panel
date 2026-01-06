"use client";

import DashboardHeader from "./DashboardHeader/DashboardHeader";
import Sidebar from "./Sidebar/Sidebar";
import { SidebarProvider } from "./Sidebar/SidebarContext";
import type { iLocale } from "../Entity/Locale/types";

interface iProps {
  children: React.ReactNode;
  locale: iLocale;
}

export default function DefaultLayout({ children, locale }: iProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <DashboardHeader locale={locale} />
        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden border-r bg-background md:block">
            <Sidebar locale={locale} />
          </aside>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
