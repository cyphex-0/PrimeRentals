const fs = require('fs');
const path = require('path');

const layoutDir = path.join(__dirname, '../src/components/layout');
if (!fs.existsSync(layoutDir)) fs.mkdirSync(layoutDir, { recursive: true });

const files = {
  'navbar.tsx': `
"use client";

import * as React from "react"
import Link from "next/link"
import { Menu, X, Home, User, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Avatar } from "../ui/avatar"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  // Mock auth state for UI development
  const isLoggedIn = false; 
  const userRole = "TENANT"; 

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur-xl dark:bg-slate-950/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl font-bold tracking-tight text-primary">RentNest</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/properties" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Properties</Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar fallback="U" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href="/dashboard/profile">
                  <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                </Link>
                <Link href={\`/dashboard/\${userRole.toLowerCase()}\`}>
                  <DropdownMenuItem><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white dark:bg-slate-950 px-4 py-6 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            <Link href="/properties" className="text-base font-medium">Properties</Link>
            <Link href="/about" className="text-base font-medium">About</Link>
            <Link href="/contact" className="text-base font-medium">Contact</Link>
            <div className="h-px bg-border my-2" />
            {!isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <Link href="/login" className="w-full"><Button variant="outline" className="w-full">Log in</Button></Link>
                <Link href="/register" className="w-full"><Button className="w-full">Sign up</Button></Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href={\`/dashboard/\${userRole.toLowerCase()}\`} className="w-full"><Button variant="outline" className="w-full">Dashboard</Button></Link>
                <Button variant="destructive" className="w-full">Logout</Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
`,
  'footer.tsx': `
import * as React from "react"
import Link from "next/link"
import { Home, Twitter, Github, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-950 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="font-heading text-xl font-bold tracking-tight text-primary">RentNest</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your trusted marketplace for modern, professional property rentals.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/properties" className="hover:text-primary transition-colors">Browse Properties</Link></li>
              <li><Link href="/landlords" className="hover:text-primary transition-colors">For Landlords</Link></li>
              <li><Link href="/tenants" className="hover:text-primary transition-colors">For Tenants</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RentNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
`,
  'sidebar.tsx': `
"use client";

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  List
} from "lucide-react"

type Role = "TENANT" | "LANDLORD" | "ADMIN";

const navItems = {
  TENANT: [
    { name: "Dashboard", href: "/dashboard/tenant", icon: LayoutDashboard },
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

export function Sidebar({ role = "TENANT" }: { role?: Role }) {
  const pathname = usePathname();
  const items = navItems[role];

  return (
    <aside className="w-64 flex-col border-r bg-slate-50 dark:bg-slate-900 h-screen hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="font-heading text-lg font-bold tracking-tight text-primary">RentNest</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          {role} Menu
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link 
                key={item.href} 
                href={item.href}
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
      
      <div className="p-4 border-t">
        <Link 
          href="/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-red-50 dark:hover:bg-red-950/50"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  )
}
`,
  'dashboard-header.tsx': `
"use client";

import * as React from "react"
import { Bell, Search, Menu } from "lucide-react"
import { Input } from "../ui/input"
import { Avatar } from "../ui/avatar"

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-slate-950">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-muted-foreground">
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
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(layoutDir, filename), content.trim());
}
console.log("Layout components generated successfully.");
