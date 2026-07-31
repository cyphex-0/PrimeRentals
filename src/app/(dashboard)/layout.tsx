"use client";

import * as React from "react"
import { useMe } from "@/hooks/api/use-auth"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: userData } = useMe();
  const user = userData?.data;
  const role = user?.role || "TENANT";
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      <Sidebar role={role} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex flex-1 flex-col overflow-hidden w-full min-w-0">
        <DashboardHeader onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 min-h-0">
          {children}
        </main>
      </div>
    </div>
  )
}