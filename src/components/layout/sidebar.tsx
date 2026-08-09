"use client";

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/lib/stores/auth-store"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Home, 
  CreditCard, 
  User, 
  Settings, 
  Building, 
  MessageSquare,
  Users,
  Layers,
  List,
  X,
  LogOut,
  Search
} from "lucide-react"

type Role = "TENANT" | "LANDLORD" | "ADMIN";

const navItems = {
  TENANT: [
    { name: "Dashboard", href: "/dashboard/tenant", icon: LayoutDashboard },
    { name: "Browse Properties", href: "/properties", icon: Search },
    { name: "My Rentals", href: "/dashboard/tenant/rentals", icon: Home },
    { name: "Payments", href: "/dashboard/tenant/payments", icon: CreditCard },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ],
  LANDLORD: [
    { name: "Dashboard", href: "/dashboard/landlord", icon: LayoutDashboard },
    { name: "Properties", href: "/dashboard/landlord/properties", icon: Building },
    { name: "Requests", href: "/dashboard/landlord/requests", icon: MessageSquare },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ],
  ADMIN: [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Properties", href: "/dashboard/admin/properties", icon: Building },
    { name: "Categories", href: "/dashboard/admin/categories", icon: Layers },
    { name: "Rentals", href: "/dashboard/admin/rentals", icon: List },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ]
}

export function Sidebar({ 
  role = "TENANT", 
  isMobileOpen = false, 
  setIsMobileOpen 
}: { 
  role?: Role;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const items = navItems[role];

  const handleLogout = () => {
    clearAuth();
    queryClient.clear();
    router.refresh();
    router.push("/auth/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}
      
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex-col border-r bg-slate-50 dark:bg-slate-900 h-full transition-transform duration-300 md:static md:flex md:translate-x-0",
        isMobileOpen ? "flex translate-x-0" : "hidden -translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b shrink-0">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileOpen?.(false)}>
            <Home className="h-6 w-6 text-primary" />
            <span className="font-heading text-lg font-bold tracking-tight text-primary">PrimeRentals</span>
          </Link>
          <button 
            className="md:hidden text-muted-foreground p-2 -mr-2"
            onClick={() => setIsMobileOpen?.(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          {role} Menu
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {items.map((item) => {
            // For the root dashboard link, it should only be active on an exact match
            const isDashboardLink = item.href.endsWith("/admin") || item.href.endsWith("/tenant") || item.href.endsWith("/landlord");
            const isActive = isDashboardLink 
              ? pathname === item.href 
              : (pathname === item.href || pathname.startsWith(item.href + '/'));
              
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileOpen?.(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-slate-500")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t shrink-0">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-red-50 dark:hover:bg-red-950/50"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </aside>
    </>
  )
}