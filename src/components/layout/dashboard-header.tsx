"use client";

import * as React from "react"
import { Search, Menu } from "lucide-react"
import { Input } from "../ui/input"
import { Avatar } from "../ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useMe } from "@/hooks/api/use-auth"
import { User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"

export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { clearAuth } = useAuthStore()
  const { data: userData } = useMe()
  const queryClient = useQueryClient()
  const user = userData?.data
  const router = useRouter()
  
  const userName = user?.name || "User"
  const userRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : "Tenant"
  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  const handleLogout = () => {
    clearAuth();
    queryClient.clear();
    router.refresh();
    router.push("/auth/login");
  };

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
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-medium leading-none">{userName}</span>
            <span className="text-xs text-muted-foreground mt-1">{userRole}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="outline-none">
                <Avatar fallback={initials} src={user?.profileImage || undefined} size="sm" className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right" className="w-56">
              <Link href="/dashboard/profile">
                <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <button onClick={handleLogout} className="w-full">
                <DropdownMenuItem destructive><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem>
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}