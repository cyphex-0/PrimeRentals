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
                <Link href={`/dashboard/${userRole.toLowerCase()}`}>
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
                <Link href={`/dashboard/${userRole.toLowerCase()}`} className="w-full"><Button variant="outline" className="w-full">Dashboard</Button></Link>
                <Button variant="destructive" className="w-full">Logout</Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}