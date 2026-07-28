"use client";

import * as React from "react"
import { Bell, Search, Menu } from "lucide-react"
import { Input } from "../ui/input"
import { Avatar } from "../ui/avatar"

export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 dark:bg-slate-950 w-full">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-muted-foreground" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden md:flex relative w-96">
          <Input 
            placeholder="Search..." 
            className="pl-10 h-10 bg-slate-50 dark:bg-slate-900" 
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:bg-slate-100 rounded-full transition-colors dark:hover:bg-slate-800">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-white dark:border-slate-950" />
        </button>
        <div className="h-8 w-px bg-border mx-1" />
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-medium leading-none">John Doe</span>
            <span className="text-xs text-muted-foreground mt-1">Tenant</span>
          </div>
          <Avatar fallback="JD" size="sm" />
        </div>
      </div>
    </header>
  )
}