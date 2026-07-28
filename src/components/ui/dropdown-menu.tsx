"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === DropdownMenuTrigger) {
          return React.cloneElement(child as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
            onClick: () => setIsOpen(!isOpen),
          });
        }
        if (React.isValidElement(child) && child.type === DropdownMenuContent) {
          return isOpen ? child : null;
        }
        return child;
      })}
    </div>
  )
}

export function DropdownMenuTrigger({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <div onClick={onClick} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  )
}

export function DropdownMenuContent({ children, className, align = "right" }: { children: React.ReactNode; className?: string; align?: "left" | "right" | "center" }) {
  return (
    <div 
      className={cn(
        "absolute z-50 mt-2 w-56 rounded-xl border bg-card p-1 shadow-lg dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-200",
        align === "right" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, onClick, className, destructive }: { children: React.ReactNode; onClick?: () => void; className?: string; destructive?: boolean }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-muted focus:bg-muted",
        destructive && "text-destructive hover:bg-destructive/10 hover:text-destructive",
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-border", className)} />
}